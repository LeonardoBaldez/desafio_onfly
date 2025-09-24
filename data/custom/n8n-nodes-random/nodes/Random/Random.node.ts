//Importações
import {
    IExecuteFunctions, //Define o tipo do this dentro do método execute
    INodeExecutionData, //É a estrutura padrão para os dados que fluem entre os nós
    INodeType, //É a estrutura que a classe Random deve seguir
    INodeTypeDescription, //Define o tipo do objeto de descrição
    NodeOperationError, //Uma classe de erro especial do n8n, lança exceções em mensagens de erro mais claras e amigáveis na interface do usuário
    IHttpRequestOptions, //Define o formato do objeto de opções que passamos para o auxiliar de requisição HTTP
} from 'n8n-workflow';

export class Random implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'True Random Number Generator', //O nome que aparece para o usuário na lista de nós
        name: 'random', //O identificador interno
        icon: 'fa:random',
        group: ['transform'], //A categoria onde o nó aparecerá no painel de nós
        version: 1,
        //O texto de ajuda que aparece quando o usuário passa o mouse sobre o nó
        description: 'Usa a API da random.org para gerar um número verdadeiramente aleatório.',
        defaults: {
            name: 'Random Number',
        },
        //Define os pontos de conexão 
        inputs: ['main'],
        outputs: ['main'],
        //Define os campos de configuração que o usuário verá no painel de opções do nó
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
    //O método execute é chamado para cada item que chega na entrada do nó quando o workflow é executado
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        //Obter Dados de Entrada
        const items = this.getInputData(); //Pega a lista de todos os itens de dados que vieram do nó anterior
        const returnData: INodeExecutionData[] = []; //Inicializa um array vazio onde vamos armazenar os resultados processados

        for (let i = 0; i < items.length; i++) {
            //Busca o valor dos campos min e max que o usuário configurou na UI
            const min = this.getNodeParameter('min', i) as number; 
            const max = this.getNodeParameter('max', i) as number;
            //Uma validação simples para garantir que a lógica faz sentido
            if (min > max) {
                throw new NodeOperationError(this.getNode(), 'O valor mínimo não pode ser maior que o máximo.');
            }

            // Faz a Requisição à API
            const options: IHttpRequestOptions = {
                method: 'GET',
                url: `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`,
                json: false, //indica que não esperamos uma resposta em JSON, mas sim em texto puro
            };
            //Processar a Resposta e Construir a Saída
            try {
                const response = await this.helpers.httpRequest(options);
                //A API retorna o número como texto, então o convertemos para um tipo numérico
                const randomNumber = parseInt(response as string, 10);
                //Tratamento de erro caso a resposta não seja numérica
                if (isNaN(randomNumber)) {
                    throw new Error('A resposta da API não foi um número válido.');
                }
                //Adicionamos um novo objeto ao array de resultados
                returnData.push({
                    json: { randomNumber },
                    pairedItem: { item: i }
                });

            } catch (error) { //Captura qualquer erro que possa ocorrer durante a chamada à API
                throw new NodeOperationError(this.getNode(), new Error(String(error)), {
                    description: 'Não foi possível buscar o número aleatório na API random.org.',
                });
            }
        }
        //Retornar os Dados Formatados
        return [returnData];
    }
}