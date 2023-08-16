function swapElements(el1, el2) {
    let prev1 = el1.previousSibling;
    let prev2 = el2.previousSibling;

    prev1.after(el2);
    prev2.after(el1);
}
  
function sortByCriteria(criteria, ascending = true) {
    return (elementA, elementB) => {
        const valueA = criteria(elementA);
        const valueB = criteria(elementB);

        let comparisonResult;

        if (typeof valueA === 'string' && typeof valueB === 'string') {
            comparisonResult = valueA.localeCompare(valueB);
        } else {
            comparisonResult = valueA - valueB;
        }

        return ascending ? comparisonResult > 0 : comparisonResult < 0;
    };
}
  
export function genericSortElements(elements, criteria, ascending = true) {
const numberOfElements = elements.length;
for (let i = 0; i < numberOfElements; i++) {
    for (let j = i + 1; j < numberOfElements; j++) {
        if (sortByCriteria(criteria, ascending)(elements[i], elements[j])) {
            swapElements(elements[i], elements[j]);
            [elements[i], elements[j]] = [elements[j], elements[i]];
        }
    }
}
}
