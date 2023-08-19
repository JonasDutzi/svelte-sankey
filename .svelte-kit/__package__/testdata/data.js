export const sankeyData = {
    data: [
        {
            id: 'input',
            columnLabel: 'Input',
            rows: [
                {
                    rowLabel: 'Product',
                    items: [
                        { id: 'flour', label: 'Flour' },
                        { id: 'biscuit', label: 'Biscuit' }
                    ]
                },
                {
                    rowLabel: 'Resource Usage',
                    items: [{ id: 'chocolate_production', label: 'Chocolate Production' }]
                }
            ]
        },
        {
            id: 'root',
            columnLabel: 'root',
            rows: [
                {
                    rowLabel: 'Product',
                    items: [{ id: 'semi_finished_good', label: 'Semi-finished good' }]
                }
            ]
        },
        {
            id: 'output',
            columnLabel: 'Output',
            rows: [
                {
                    rowLabel: 'Product',
                    items: [
                        { id: 'strawberrycake', label: 'Strawberry Cake' },
                        { id: 'chococake', label: 'Chocolate Cake' }
                    ]
                }
            ]
        }
    ],
    links: [
        {
            source: 'flour',
            target: 'semi_finished_good',
            value: 5
        },
        {
            source: 'biscuit',
            target: 'semi_finished_good',
            value: 3
        },
        {
            source: 'chocolate_production',
            target: 'semi_finished_good',
            value: 8
        },
        {
            source: 'semi_finished_good',
            target: 'strawberrycake',
            value: 8
        },
        {
            source: 'semi_finished_good',
            target: 'chococake',
            value: 8
        }
    ]
};
