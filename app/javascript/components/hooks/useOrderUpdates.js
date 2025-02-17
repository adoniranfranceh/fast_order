import { useEffect } from 'react';
import { createConsumer } from '@rails/actioncable';

const cable = createConsumer('ws://localhost/cable');

export const useOrderUpdates = (setOrders) => {
  useEffect(() => {
    const subscription = cable.subscriptions.create('OrdersChannel', {
      received: (data) => {
        setOrders(prevOrders => [data, ...prevOrders]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setOrders]);
};
