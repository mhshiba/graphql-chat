import { useQuery, useMutation, useSubscription } from '@apollo/client';
import React, { useState } from 'react';
import { messagesQuery, addMessageMutation, messageAddedSubscription } from './graphql/queries';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

const Chat = ({user}) => {
  // Tem mais atributos do useQuery, mas esses são os mais usados
  // Poderia/deveria usar o loading e error para tratamento diferenciados
  // enquanto os dados ainda não estão prontos
  const { loading, error, data } = useQuery(messagesQuery);
  const { data2 } = useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({subscriptionData}) => {
      console.log('onSubscriptionData', subscriptionData.data.messageAdded);
    }
  });
  const [ addMessage, result ] = useMutation(addMessageMutation);
  const [ messages, setMessages ] = useState([]);

  const handleSend = async (text) => {
    await addMessage({variables: {input: {text}}});
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Chatting as {user}</h1>
        <MessageList user={user} messages={messages} />
        <MessageInput onSend={handleSend} />
      </div>
    </section>
  );
}

export default Chat;
