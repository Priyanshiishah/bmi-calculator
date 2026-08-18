const form = document.querySelector('#bmi-form');
const heightInput = document.querySelector('#height');
const inchesInput = document.querySelector('#height-inches');
const weightInput = document.querySelector('#weight');
const resultPanel = document.querySelector('#result-panel');
const emptyState = document.querySelector('#empty-state');
const resultContent = document.querySelector('#result-content');
const score = document.querySelector('#bmi-score');
const category = document.querySelector('#bmi-category');
const marker = document.querySelector('#gauge-marker');
const insight = document.querySelector('#health-insight');
const healthyRange = document.querySelector('#healthy-range');
const resetButton = document.querySelector('#reset-button');
const submitButton = form.querySelector('button[type="submit"]');
const unitOptions = document.querySelectorAll('.unit-option');
const heightUnit = document.querySelector('#height-unit');
const weightUnit = document.querySelector('#weight-unit');
const heightFields = document.querySelector('.height-fields');
const inchesControl = document.querySelector('.inches-control');

let measurementSystem = 'metric';
let currentResult = null;

const unitSettings = {
    metric: {
        height: { min: 80, max: 250, unit: 'cm' },
        weight: { min: 25, max: 350, unit: 'kg' },
    },
    imperial: {
        height: { min: 2, max: 8, unit: 'ft' },
        weight: { min: 55, max: 772, unit: 'lb' },
    },
};

const insights = {
    Underweight:
        'Your BMI is below the healthy range. A healthcare professional can help you build a balanced nutrition plan.',
    'Normal weight':
        'Your BMI falls within the healthy range. Keep supporting it with balanced nutrition and regular movement.',
    Overweight:
        'Your BMI is slightly above the healthy range. Small, sustainable lifestyle changes can make a meaningful difference.',
    'Moderately Obese':
        'Your BMI indicates an increased health risk. Consider discussing achievable next steps with a healthcare professional.',
    'Severely Obese':
        'Your BMI indicates a high health risk. Personalized guidance from a healthcare professional is recommended.',
    'Very severely Obese':
        'Your BMI indicates a very high health risk. Please speak with a healthcare professional for tailored support.',
};

function validateField(input, min, max, label) {
    const value = Number(input.value);
    const error = document.querySelector(`#${input.id}-error`);
    let message = '';

    if (!input.value.trim()) {
        message = `${label} is required.`;
    } else if (!Number.isFinite(value) || value < min || value > max) {
        message = `Enter a ${label.toLowerCase()} between ${min} and ${max}.`;
    }

    input.closest('.input-control').classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
    error.textContent = message;
    return !message;
}

function markerPosition(bmi) {
    const minimum = 12;
    const maximum = 45;
    const clamped = Math.min(Math.max(bmi, minimum), maximum);
    return ((clamped - minimum) / (maximum - minimum)) * 100;
}

function calculateBmi(heightCm, weightKg) {
    const bmi = Math.round((weightKg / Math.pow(heightCm / 100, 2)) * 100) / 100;
    let bmiCategory;
    let healthRisk;

    if (bmi < 18.5) {
        bmiCategory = 'Underweight';
        healthRisk = 'Malnutrition risk';
    } else if (bmi < 25) {
        bmiCategory = 'Normal weight';
        healthRisk = 'Low risk';
    } else if (bmi < 30) {
        bmiCategory = 'Overweight';
        healthRisk = 'Enhanced risk';
    } else if (bmi < 35) {
        bmiCategory = 'Moderately Obese';
        healthRisk = 'Medium risk';
    } else if (bmi < 40) {
        bmiCategory = 'Severely Obese';
        healthRisk = 'High risk';
    } else {
        bmiCategory = 'Very severely Obese';
        healthRisk = 'Very High risk';
    }

    return {
        BMI: bmi,
        'BMI Category': bmiCategory,
        'Health Risk': healthRisk,
    };
}

function displayResult(data, heightCm) {
    const minimumWeightKg = 18.5 * Math.pow(heightCm / 100, 2);
    const maximumWeightKg = 24.9 * Math.pow(heightCm / 100, 2);
    const isImperial = measurementSystem === 'imperial';
    const minimumWeight = isImperial ? minimumWeightKg * 2.20462 : minimumWeightKg;
    const maximumWeight = isImperial ? maximumWeightKg * 2.20462 : maximumWeightKg;
    const displayUnit = isImperial ? 'lb' : 'kg';

    score.textContent = data.BMI.toFixed(1);
    category.textContent = data['BMI Category'];
    insight.textContent = insights[data['BMI Category']];
    healthyRange.textContent = `${minimumWeight.toFixed(1)} - ${maximumWeight.toFixed(1)} ${displayUnit}`;
    marker.style.left = `${markerPosition(data.BMI)}%`;

    emptyState.hidden = true;
    resultContent.hidden = false;
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function validateHeight() {
    if (measurementSystem === 'metric') {
        return validateField(heightInput, 80, 250, 'Height');
    }

    const feet = Number(heightInput.value);
    const inches = inchesInput.value.trim() ? Number(inchesInput.value) : 0;
    const totalInches = feet * 12 + inches;
    let message = '';

    if (!heightInput.value.trim()) {
        message = 'Height in feet is required.';
    } else if (
        !Number.isFinite(feet) ||
        !Number.isFinite(inches) ||
        inches < 0 ||
        inches >= 12 ||
        totalInches < 31 ||
        totalInches > 98
    ) {
        message = 'Enter a height using 2-8 feet and 0-11 inches.';
    }

    heightInput.closest('.input-control').classList.toggle('invalid', Boolean(message));
    inchesControl.classList.toggle('invalid', Boolean(message));
    heightInput.setAttribute('aria-invalid', String(Boolean(message)));
    inchesInput.setAttribute('aria-invalid', String(Boolean(message)));
    document.querySelector('#height-error').textContent = message;
    return !message;
}

function updateInputSettings() {
    const settings = unitSettings[measurementSystem];

    [
        [heightInput, settings.height],
        [weightInput, settings.weight],
    ].forEach(([input, inputSettings]) => {
        input.min = inputSettings.min;
        input.max = inputSettings.max;
    });

    heightUnit.textContent = settings.height.unit;
    weightUnit.textContent = settings.weight.unit;
    const isImperial = measurementSystem === 'imperial';
    heightFields.classList.toggle('imperial', isImperial);
    inchesControl.hidden = !isImperial;
}

function convertInputValue(input, factor) {
    if (!input.value.trim()) {
        return;
    }

    input.value = (Number(input.value) * factor).toFixed(1).replace(/\.0$/, '');
}

function switchMeasurementSystem(event) {
    const nextSystem = event.currentTarget.dataset.system;

    if (nextSystem === measurementSystem) {
        return;
    }

    const toImperial = nextSystem === 'imperial';

    if (heightInput.value.trim()) {
        if (toImperial) {
            const totalInches = Number(heightInput.value) / 2.54;
            const feet = Math.floor(totalInches / 12);
            const inches = totalInches - feet * 12;
            heightInput.value = feet;
            inchesInput.value = inches.toFixed(1).replace(/\.0$/, '');
        } else {
            const feet = Number(heightInput.value);
            const inches = inchesInput.value.trim() ? Number(inchesInput.value) : 0;
            heightInput.value = ((feet * 12 + inches) * 2.54)
                .toFixed(1)
                .replace(/\.0$/, '');
            inchesInput.value = '';
        }
    }

    convertInputValue(weightInput, toImperial ? 2.20462 : 0.453592);
    measurementSystem = nextSystem;
    updateInputSettings();

    unitOptions.forEach((option) => {
        const isActive = option.dataset.system === measurementSystem;
        option.classList.toggle('active', isActive);
        option.setAttribute('aria-pressed', String(isActive));
    });

    document.querySelectorAll('.field-error').forEach((element) => {
        element.textContent = '';
    });
    document.querySelectorAll('.input-control').forEach((element) => {
        element.classList.remove('invalid');
    });

    if (currentResult) {
        displayResult(currentResult.data, currentResult.heightCm);
    }
}

function calculate(event) {
    event.preventDefault();

    const settings = unitSettings[measurementSystem];
    const heightIsValid = validateHeight();
    const weightIsValid = validateField(
        weightInput,
        settings.weight.min,
        settings.weight.max,
        'Weight'
    );

    if (!heightIsValid || !weightIsValid) {
        return;
    }

    const enteredHeight = Number(heightInput.value);
    const enteredInches = inchesInput.value.trim() ? Number(inchesInput.value) : 0;
    const enteredWeight = Number(weightInput.value);
    const isImperial = measurementSystem === 'imperial';
    const heightCm = isImperial
        ? (enteredHeight * 12 + enteredInches) * 2.54
        : enteredHeight;
    const weightKg = isImperial ? enteredWeight * 0.453592 : enteredWeight;
    const data = calculateBmi(heightCm, weightKg);
    currentResult = { data, heightCm };
    displayResult(data, heightCm);
}

function resetCalculator() {
    form.reset();
    currentResult = null;
    resultContent.hidden = true;
    emptyState.hidden = false;
    document.querySelectorAll('.field-error').forEach((element) => {
        element.textContent = '';
    });
    document.querySelectorAll('.input-control').forEach((element) => {
        element.classList.remove('invalid');
    });
    heightInput.focus();
}

form.addEventListener('submit', calculate);
resetButton.addEventListener('click', resetCalculator);
unitOptions.forEach((option) => {
    option.addEventListener('click', switchMeasurementSystem);
});

[heightInput, inchesInput, weightInput].forEach((input) => {
    input.addEventListener('input', () => {
        input.closest('.input-control').classList.remove('invalid');
        input.removeAttribute('aria-invalid');
        const errorId = input === weightInput ? 'weight-error' : 'height-error';
        document.querySelector(`#${errorId}`).textContent = '';

        if (input === heightInput || input === inchesInput) {
            heightInput.closest('.input-control').classList.remove('invalid');
            inchesControl.classList.remove('invalid');
        }
    });
});
