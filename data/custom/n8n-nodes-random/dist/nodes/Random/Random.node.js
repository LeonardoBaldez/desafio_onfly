"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
const n8n_workflow_1 = require("n8n-workflow");
class Random {
    description = {
        displayName: 'True Random Number Generator',
        name: 'random',
        icon: 'fa:random',
        group: ['transform'],
        version: 1,
        description: 'Usa a API da random.org para gerar um número verdadeiramente aleatório.',
        defaults: {
            name: 'Random Number',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Mínimo',
                name: 'min',
                type: 'number',
                default: 1,
                required: true,
                description: 'O menor valor a ser retornado (inclusivo).',
            },
            {
                displayName: 'Máximo',
                name: 'max',
                type: 'number',
                default: 100,
                required: true,
                description: 'O maior valor a ser retornado (inclusivo).',
            },
        ],
    };
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const min = this.getNodeParameter('min', i);
            const max = this.getNodeParameter('max', i);
            if (min > max) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'O valor mínimo não pode ser maior que o máximo.');
            }
            // Objeto de opções com a tipagem correta e URL dinâmica
            const options = {
                method: 'GET',
                url: `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`,
                json: false,
            };
            try {
                const response = await this.helpers.httpRequest(options);
                const randomNumber = parseInt(response, 10);
                if (isNaN(randomNumber)) {
                    throw new Error('A resposta da API não foi um número válido.');
                }
                returnData.push({
                    json: { randomNumber },
                    pairedItem: { item: i }
                });
            }
            catch (error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), new Error(String(error)), {
                    description: 'Não foi possível buscar o número aleatório na API random.org.',
                });
            }
        }
        return [returnData];
    }
}
exports.Random = Random;
