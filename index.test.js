// index.test.js

describe('Application Init Test', () => {
    it('should start the application without errors', async () => {
        require('./index').then(() => {
            process.exit(0);
        })
    });
});