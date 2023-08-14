function swapElements(element1, element2) {
    const parent = element1.parentNode;
  
    // Insert element2 before element1
    parent.insertBefore(element2, element1);
  
    // Move element1 to the position of element2 (which is now before element1)
    parent.insertBefore(element1, element2.nextSibling);
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
