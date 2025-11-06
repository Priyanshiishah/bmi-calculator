module.exports = function calculateBMI(height, weight) {
    let htM = height / 100;

    let bmiCat = null;
    let risk = null;

    let bmi =
        Math.round((weight / Math.pow(htM, 2) + Number.EPSILON) * 100) / 100;

    if (bmi < 18.5) {
        bmiCat = 'Underweight';
        risk = 'Malnutrition risk';
    } else if (bmi >= 18.5 && bmi < 25) {
        bmiCat = 'Normal weight';
        risk = 'Low risk';
    } else if (bmi >= 25 && bmi < 30) {
        bmiCat = 'Overweight';
        risk = 'Enhanced risk';
    } else if (bmi >= 30 && bmi < 35) {
        bmiCat = 'Moderately Obese';
        risk = 'Medium risk';
    } else if (bmi >= 35 && bmi < 40) {
        bmiCat = 'Severely Obese';
        risk = 'High risk';
    } else if (bmi >= 40) {
        bmiCat = 'Very severely Obese';
        risk = 'Very High risk';
    }
    return { bmi, bmiCat, risk };
};
