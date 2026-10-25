const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const script = readFileSync(require('node:path').join(__dirname, '../js/weather.js'), 'utf8');
function fixture({ fail = false, locationFail = false } = {}) {
    const nodes = new Map(); const events = {}; const calls = []; let geos = 0; let okLocation;
    for (const selector of ['#weather-key-form', '#weather-key', '#weather span:first-child', '#weather span:last-child', '#weather-disable']) {
        nodes.set(selector, { value: '', innerText: '', addEventListener(event, fn) { events[`${selector}:${event}`] = fn; } });
    }
    const context = {
        document: { querySelector: s => nodes.get(s) }, window: { addEventListener(event, fn) { events[event] = fn; } },
        navigator: { geolocation: { getCurrentPosition(ok, bad) { geos++; okLocation = ok; if (locationFail) bad(); } } },
        URLSearchParams, AbortController,
        fetch: async (url, options) => { calls.push({ url, options }); return { ok: !fail, json: async () => ({ weather: [{ main: 'Clear' }], main: { temp: 22.4 }, name: '<img src=x>' }) }; },
    };
    // Persistence APIs deliberately absent: the real script must not use them.
    vm.runInNewContext(script, context);
    return {
        nodes, events, calls, get geos() { return geos; },
        submit(key) { nodes.get('#weather-key').value = key; events['#weather-key-form:submit']({ preventDefault() {} }); },
        locate() { return okLocation({ coords: { latitude: 1, longitude: 2 } }); },
    };
}
const dummy = 'a'.repeat(32); // Synthetic, never sent to an external service.
test('disabled by default: no geolocation, fetch, or shared key', () => {
    const f = fixture(); assert.equal(f.geos, 0); assert.equal(f.calls.length, 0);
    assert.ok(!/[a-f0-9]{32}/i.test(script));
});
test('only explicit user input enables location/weather and renders as text', async () => {
    const f = fixture(); f.submit(dummy); assert.equal(f.geos, 1); assert.equal(f.nodes.get('#weather-key').value, '');
    await f.locate(); assert.equal(f.calls.length, 1);
    const url = new URL(f.calls[0].url); assert.equal(url.origin, 'https://api.openweathermap.org'); assert.equal(url.searchParams.get('appid'), dummy);
    assert.equal(f.calls[0].options.credentials, 'omit'); assert.equal(f.calls[0].options.referrerPolicy, 'no-referrer');
    assert.equal(f.nodes.get('#weather span:first-child').innerText, 'Clear / 22°C');
    assert.equal(f.nodes.get('#weather span:last-child').innerText, '<img src=x>');
});
test('invalid input and denied geolocation do not fetch', () => {
    const f = fixture(); f.submit('bad'); assert.equal(f.geos, 0); assert.equal(f.calls.length, 0);
    const denied = fixture({ locationFail: true }); denied.submit(dummy); assert.equal(denied.calls.length, 0);
});
test('disable and pagehide invalidate pending location callbacks', async () => {
    for (const event of ['#weather-disable:click', 'pagehide']) {
        const f = fixture(); f.submit(dummy); f.events[event](); await f.locate(); assert.equal(f.calls.length, 0);
    }
});
test('provider failure is handled without exposing a key or URL', async () => {
    const f = fixture({ fail: true }); f.submit(dummy); await f.locate();
    const message = f.nodes.get('#weather span:first-child').innerText;
    assert.ok(message.includes('날씨')); assert.ok(!message.includes(dummy)); assert.ok(!message.includes('https:'));
});
test('reload starts disabled even after a previous page enabled weather', () => {
    const f = fixture(); f.submit(dummy); const next = fixture(); assert.equal(next.geos, 0); assert.equal(next.calls.length, 0);
});
