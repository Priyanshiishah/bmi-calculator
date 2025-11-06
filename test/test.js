process.env.NODE_ENV = 'test';

const assert = require('assert');
const bmiFn = require('../src/calculate');

describe('Checking Test Cases', () => {
    it('Test 1', () => {
        assert.deepStrictEqual(bmiFn(175, 75), {
            bmi: 24.49,
            bmiCat: 'Normal weight',
            risk: 'Low risk',
        });
    });
    it('Test 2', () => {
        assert.deepStrictEqual(bmiFn(161, 85), {
            bmi: 32.79,
            bmiCat: 'Moderately Obese',
            risk: 'Medium risk',
        });
    });
    it('Test 3', () => {
        assert.deepStrictEqual(bmiFn(135, 97), {
            bmi: 53.22,
            bmiCat: 'Very severely Obese',
            risk: 'Very High risk',
        });
    });
});
