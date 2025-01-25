describe('BCA Viewer', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="grid"></div>
            <div id="loader"></div>
            <div id="error"></div>
            <input id="search">
        `;

        global.fetch = jest.fn(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: 'Test Item' }])
        }));
    });

    test('displays data after successful fetch', async () => {
        const { fetchData } = require('../../public/js/app.js');
        await fetchData();
        expect(document.getElementById('grid').innerHTML).toContain('Test Item');
    });

    test('handles search input', () => {
        const { handleSearch } = require('../../public/js/app.js');
        const event = { target: { value: 'test' } };
        handleSearch(event);
        // Add more assertions based on your search logic
    });
});
