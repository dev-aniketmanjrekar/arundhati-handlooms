import { useState, useMemo } from 'react';

export const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle nested properties if key contains dots (e.g., 'user.name')
                if (sortConfig.key.includes('.')) {
                    const keys = sortConfig.key.split('.');
                    aValue = keys.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, a);
                    bValue = keys.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, b);
                }

                // Handle null/undefined values
                if (aValue === null || aValue === undefined) aValue = '';
                if (bValue === null || bValue === undefined) bValue = '';

                // Handle numbers
                if (!isNaN(parseFloat(aValue)) && !isNaN(parseFloat(bValue))) {
                    aValue = parseFloat(aValue);
                    bValue = parseFloat(bValue);
                } else {
                    // Handle strings (case-insensitive)
                    aValue = String(aValue).toLowerCase();
                    bValue = String(bValue).toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};
