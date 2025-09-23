"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Random {
    description = {
        displayName: 'True Random Number Generator',
        name: 'random',
        group: ['transform'],
        version: 1,
        description: 'Gera números ou itens aleatórios',
        defaults: {
            name: 'Random',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Operação',
                name: 'operation',
                type: 'options',
                options: [
                    {
                        name: 'Número',
                        value: 'number',
                        description: 'Gerar número aleatório',
                    },
                    {
                        name: 'Item',
                        value: 'item',
                        description: 'Escolher item aleatório',
                    },
                ],
                default: 'number',
            },
            {
                displayName: 'Mínimo',
                name: 'min',
                type: 'number',
                default: 0,
                description: 'Valor mínimo (inclusive)',
                displayOptions: {
                    show: {
                        operation: ['number'],
                    },
                },
            },
            {
                displayName: 'Máximo',
                name: 'max',
                type: 'number',
                default: 100,
                description: 'Valor máximo (inclusive)',
                displayOptions: {
                    show: {
                        operation: ['number'],
                    },
                },
            },
            {
                displayName: 'Itens',
                name: 'items',
                type: 'string',
                typeOptions: {
                    multipleValues: true,
                    multipleValueButtonText: 'Adicionar item',
                },
                default: [],
                placeholder: 'item1,item2,item3',
                description: 'Lista de itens para escolher aleatoriamente',
                displayOptions: {
                    show: {
                        operation: ['item'],
                    },
                },
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const operation = this.getNodeParameter('operation', i);
            if (operation === 'number') {
                const min = this.getNodeParameter('min', i);
                const max = this.getNodeParameter('max', i);
                if (min > max) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'O valor mínimo não pode ser maior que o máximo.');
                }
                const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
                returnData.push({
                    json: { randomNumber },
                });
            }
            if (operation === 'item') {
                const itemsList = this.getNodeParameter('items', i);
                if (!itemsList.length) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Nenhum item fornecido.');
                }
                const randomIndex = Math.floor(Math.random() * itemsList.length);
                const randomItem = itemsList[randomIndex];
                returnData.push({
                    json: { randomItem },
                });
            }
        }
        return [returnData];
    }
}
exports.Random = Random;
