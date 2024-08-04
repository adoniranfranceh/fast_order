import { createConsumer } from "@rails/actioncable";

console.log("Configurando o Action Cable consumer...");
const consumer = createConsumer();

export default consumer;
console.log("Consumer criado:", consumer);
