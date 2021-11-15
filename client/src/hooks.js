import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries';

export function useChatMessages() {
  // Tem mais atributos do useQuery, mas esses são os mais usados
  // Poderia/deveria usar o loading e error para tratamento diferenciados
  // enquanto os dados ainda não estão prontos
  const { data } = useQuery(messagesQuery);
  console.log('data', data);
  const messages = data ? data.messages: [];
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({client, subscriptionData}) => {
      // Atualiza o cache, e então o componente é reenderizado
      // E com o cache atualizado, o `useQuery(messagesQuery)` vai
      // usar esses dados recém atualizados
      client.writeQuery({
        query: messagesQuery,
        data: {
          messages: messages.concat(subscriptionData.data.messageAdded)
        }
      })
    }
  });
  const [ addMessage ] = useMutation(addMessageMutation);
  return {
    messages,
    addMessage: (text) => addMessage({variables: {input: {text}}}),
  };
}