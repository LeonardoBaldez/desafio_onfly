import {
    IExecuteFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
    NodeOperationError,
    IHttpRequestOptions, // Importação adicionada
} from 'n8n-workflow';

export class Random implements INodeType {
    description: INodeTypeDescription = {
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

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const min = this.getNodeParameter('min', i) as number;
            const max = this.getNodeParameter('max', i) as number;

            if (min > max) {
                throw new NodeOperationError(this.getNode(), 'O valor mínimo não pode ser maior que o máximo.');
            }

            // Objeto de opções com a tipagem correta e URL dinâmica
            const options: IHttpRequestOptions = {
                method: 'GET',
                url: `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`,
                json: false,
            };

            try {
                const response = await this.helpers.httpRequest(options);
                const randomNumber = parseInt(response as string, 10);

                if (isNaN(randomNumber)) {
                    throw new Error('A resposta da API não foi um número válido.');
                }

                returnData.push({
                    json: { randomNumber },
                    pairedItem: { item: i }
                });

            } catch (error) {
                throw new NodeOperationError(this.getNode(), new Error(String(error)), {
                    description: 'Não foi possível buscar o número aleatório na API random.org.',
                });
            }
        }

        return [returnData];
    }
}