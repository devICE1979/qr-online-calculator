// calculator-algorithm.js
window.calculateAccessCode = function(url) {
    try {
        const codes = extractCodesFromURL(url);
        const fourDigitCode = findFourDigitCode(codes);
        const result = calculateFinalResult(fourDigitCode);
        return result;
    } catch (error) {
        console.error('Ошибка вычисления:', error);
        return null;
    }
}

function extractCodesFromURL(urlString) {
    try {
        const url = new URL(urlString);
        const params = new URLSearchParams(url.search);
        let codes = {};
        
        for (let [key, value] of params) {
            if (key.startsWith('Code')) {
                codes[key] = parseInt(value);
            }
        }
        return codes;
    } catch (error) {
        throw new Error('Неверный формат URL');
    }
}

function findFourDigitCode(codesMap) {
    if (codesMap['Code4']) {
        return codesMap['Code4'];
    }
    
    const codeKeys = Object.keys(codesMap);
    for (let i = 0; i < codeKeys.length; i++) {
        const key = codeKeys[i];
        if (key.startsWith('Code') && codesMap[key].toString().startsWith('4')) {
            return codesMap[key];
        }
    }
    return null;
}

function calculateFinalResult(mainCode) {
    if (!mainCode) return null;
    
    const configuration = obtainSettings();
    const processedConfig = transformConfiguration(configuration);
    
    for (let index = processedConfig.checkPoints.length - 1; index >= 0; index--) {
        if (mainCode >= processedConfig.checkPoints[index]) {
            return mainCode - processedConfig.deductionValues[index];
        }
    }
    return null;
}

function obtainSettings() {
    return {
        segmentAlpha: "442000,441473",
        segmentBeta: ["444000", "443473"],
        segmentGamma: { thresholdValue: 445000, baseNumber: 443475 },
        segmentDelta: { check: 454000, subtract: 453487 },
        segmentEpsilon: "456000:455487",
        extraParams: {
            offset: 0,
            multiplier: 1
        }
    };
}

function transformConfiguration(rawConfig) {
    const checkPoints = [];
    const deductionValues = [];
    
    const alphaComponents = rawConfig.segmentAlpha.split(',');
    checkPoints.push(parseInt(alphaComponents[0]) + rawConfig.extraParams.offset);
    deductionValues.push(parseInt(alphaComponents[1]) + rawConfig.extraParams.offset);
    
    checkPoints.push(parseInt(rawConfig.segmentBeta[0]) * rawConfig.extraParams.multiplier);
    deductionValues.push(parseInt(rawConfig.segmentBeta[1]) * rawConfig.extraParams.multiplier);
    
    checkPoints.push(rawConfig.segmentGamma.thresholdValue);
    deductionValues.push(rawConfig.segmentGamma.baseNumber);
    
    checkPoints.push(rawConfig.segmentDelta.check);
    deductionValues.push(rawConfig.segmentDelta.subtract);
    
    const epsilonParts = rawConfig.segmentEpsilon.split(':');
    checkPoints.push(parseInt(epsilonParts[0]));
    deductionValues.push(parseInt(epsilonParts[1]));
    
    return { 
        checkPoints, 
        deductionValues 
    };
}
