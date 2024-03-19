// Load TensorFlow.js library
import * as tf from '@tensorflow/tfjs';

// Define your custom dataset
const dataset = [
  { input: 'Hi', output: 'Hello! How can I help you?' },
  { input: 'How does your service work?', output: 'Our service works by...' },
  // Add more pairs as needed
];

// Convert text data to tensors
const trainingData = tf.data.array(
  dataset.map(item => ({
    x: item.input,
    y: item.output
  }))
);

// Build a simple model
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [1], units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'linear' }));
model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

// Train the model
async function trainModel() {
  const epochs = 100;
  await model.fit(trainingData, { epochs });
  console.log('Model trained!');
}

// Save the model
async function saveModel() {
  await model.save('localstorage://my-model-1');
}

// Train and save the model
trainModel().then(() => saveModel());
