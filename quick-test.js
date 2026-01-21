const { chromium } = require('@playwright/test');

const DEMOS = [
    'leaflet-realtime', 'leaflet-draw', 'leaflet-cluster',
    'mapbox-3d-terrain', 'mapbox-animate', 'mapbox-heatmap',
    'arcgis-query', 'arcgis-sketch', 'arcgis-scene',
    'google-streetview', 'google-traffic', 'google-places', 'google-heatmap',
    'here-routing', 'here-traffic', 'here-isoline',
    'cesium-globe', 'cesium-flight', 'cesium-terrain',
    'turf-buffer', 'turf-voronoi', 'turf-isolines',
    'maplibre-3d', 'maplibre-geojson', 'maplibre-heatmap',
    'deckgl-arcs', 'deckgl-hexagons', 'earthquake-live'
];

async function testDemos() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const results = { working: [], broken: [], errors: {} };
    let currentErrors = [];

    page.on('pageerror', err => {
        currentErrors.push(err.message);
    });
    page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) {
            currentErrors.push(msg.text());
        }
    });

    await page.goto('https://arcgis-tools.vercel.app/open-lab.html');
    await page.waitForTimeout(3000);

    await page.evaluate(() => {
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        const playground = document.getElementById('playground');
        if (playground) playground.classList.add('active');
    });
    await page.waitForTimeout(1000);

    for (const demo of DEMOS) {
        currentErrors = [];
        console.log(`Testing: ${demo}...`);

        try {
            await page.selectOption('#demoSelect', demo);
            await page.waitForTimeout(300);
            await page.click('button:has-text("Run")');
            await page.waitForTimeout(5000);

            const mapContainer = page.locator('#output-map');

            const checks = {
                canvas: await mapContainer.locator('canvas').count(),
                svg: await mapContainer.locator('svg').count(),
                tiles: await mapContainer.locator('img').count(),
                leaflet: await mapContainer.locator('.leaflet-container').count(),
                cesium: await mapContainer.locator('.cesium-widget').count(),
                mapbox: await mapContainer.locator('.mapboxgl-map').count(),
                maplibre: await mapContainer.locator('.maplibregl-map').count(),
                google: await page.evaluate(() => document.querySelector('#output-map .gm-style') ? 1 : 0),
                here: await mapContainer.locator('[class*="H_ui"]').count(),
                arcgis: await mapContainer.locator('.esri-view').count(),
                fallback: await mapContainer.locator('div h3').count(), // For graceful error handling
            };

            const hasContent = Object.values(checks).some(v => v > 0);
            const detail = Object.entries(checks).filter(([k,v]) => v > 0).map(([k,v]) => k).join(', ');

            if (hasContent) {
                results.working.push(demo);
                console.log(`  ✅ ${demo} (${detail})`);
            } else {
                results.broken.push(demo);
                results.errors[demo] = currentErrors.length > 0 ?
                    currentErrors.slice(0, 3) : ['No visual content rendered'];
                console.log(`  ❌ ${demo}`);
                if (currentErrors.length > 0) {
                    console.log(`     ${currentErrors[0].substring(0, 80)}`);
                }
            }

            await page.screenshot({ path: `screenshots/${demo}.png` });

        } catch (err) {
            results.broken.push(demo);
            results.errors[demo] = [err.message];
            console.log(`  ❌ ${demo}: ${err.message.substring(0, 60)}`);
        }
    }

    await browser.close();

    console.log('\n\n========== RESULTS ==========');
    console.log(`\n✅ WORKING (${results.working.length}/${DEMOS.length}):`);
    results.working.forEach(d => console.log(`   - ${d}`));
    console.log(`\n❌ BROKEN (${results.broken.length}/${DEMOS.length}):`);
    results.broken.forEach(d => {
        console.log(`   - ${d}`);
        if (results.errors[d]) {
            results.errors[d].forEach(e => console.log(`     ${e.substring(0, 100)}`));
        }
    });
}

testDemos().catch(console.error);
