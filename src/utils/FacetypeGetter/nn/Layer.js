let sigmoid = (x) => {
  return 1 / (1 + Math.exp(-x));
};

let derivative_sigmoid = (x) => {
  return sigmoid(x) * (1 - sigmoid(x));
};

let gen_matrix = (x, y, value = () => (Math.random() * 2 - 1) / 1000) => {
  let matrix = [];

  for (let x_i = 0; x_i < x; x_i++) {
    matrix.push([]);

    for (let y_i = 0; y_i < y; y_i++) {
      matrix[x_i].push(value());
    }
  }

  return matrix;
};

class MemoryCell {
  constructor(size) {
    this.outputs = gen_matrix(size, 1, () => 0);
    this.derivative_outputs = gen_matrix(size, 1, () => 1);
    this.errors = gen_matrix(size, 1, () => 0);
    this.bias = gen_matrix(size, 1);

    this.propagate_sum = gen_matrix(size, 1, () => 0);
    this.activation_sum = gen_matrix(size, 1);
  }
}

let transform = {
  activate: (layer, self = false) => {
    let i;
    let k;

    let incoming_layer = layer.incoming_layer;
    let memory = "public_memory";

    if (self) {
      incoming_layer = layer;
      memory = "private_memory";
    }

    layer[memory].activation_sum = JSON.parse(
      JSON.stringify(layer[memory].bias)
    );

    for (i = 0; i < layer.size; i++) {
      for (k = 0; k < incoming_layer.size; k++) {
        layer[memory].activation_sum[i][0] +=
          incoming_layer[memory].outputs[k][0] * incoming_layer.weights[k][i];
      }
    }

    for (i = 0; i < layer.size; i++) {
      layer[memory].outputs[i][0] = sigmoid(layer[memory].activation_sum[i][0]);
      layer[memory].derivative_outputs[i][0] = derivative_sigmoid(
        layer[memory].activation_sum[i][0]
      );
    }
  },
  propagate: (layer, outputs, self = false) => {
    let outgoing_layer = layer.outgoing_layer;
    let memory = "public_memory";

    if (self) {
      outgoing_layer = layer;
      memory = "private_memory";
    }

    layer[memory].propagate_sum.forEach(
      (i, index) => (layer[memory].propagate_sum[index][0] = 0)
    );
    let i;
    let k;

    if (outgoing_layer) {
      for (i = 0; i < layer.size; i++) {
        for (k = 0; k < outgoing_layer.size; k++) {
          layer.weights[i][k] -=
            layer.rate *
            outgoing_layer[memory].errors[k][0] *
            layer[memory].outputs[i][0];

          layer[memory].propagate_sum[i][0] +=
            layer.weights[i][k] * outgoing_layer[memory].errors[k][0];
        }
      }
    } else {
      for (i = 0; i < layer.size; i++) {
        layer[memory].propagate_sum[i][0] =
          layer[memory].outputs[i][0] - outputs[i][0];
      }
    }

    for (let i = 0; i < layer.size; i++) {
      layer[memory].errors[i][0] =
        layer[memory].propagate_sum[i][0] *
        layer[memory].derivative_outputs[i][0];
      layer[memory].bias[i][0] -= layer.rate * layer[memory].errors[i][0];
    }
  },
};

class Layer {
  constructor(size, rate, recurrent) {
    this.incoming_layer = false;
    this.outgoing_layer = false;

    this.size = size;
    this.rate = rate;

    this.public_memory = new MemoryCell(size);
    this.private_memory = new MemoryCell(size);

    this.recurrent = recurrent;
  }

  Download() {
    let config = {};

    config.size = this.size;
    config.rate = this.rate;

    config.outputs = this.public_memory.outputs;
    config.derivative_outputs = this.public_memory.derivative_outputs;
    config.errors = this.public_memory.errors;
    config.bias = this.public_memory.bias;

    config.weights = this.weights;

    return config;
  }

  Upload(config) {
    this.size = config.size;
    this.rate = config.rate;
    this.public_memory.outputs = config.outputs;
    this.public_memory.derivative_outputs = config.derivative_outputs;
    this.public_memory.errors = config.errors;
    this.public_memory.bias = config.bias;
    this.weights = config.weights;
  }

  Connect(outgoing_layer) {
    this.outgoing_layer = outgoing_layer;
    this.outgoing_layer.incoming_layer = this;
    this.weights = gen_matrix(this.size, this.outgoing_layer.size);
  }

  Activation(inputs = false) {
    if (!this.incoming_layer) {
      this.public_memory.outputs = inputs;

      return this.outgoing_layer.Activation(this.public_memory.outputs);
    }

    this.recurrent && transform.activate(this, this.recurrent);
    transform.activate(this);

    if (this.outgoing_layer) {
      return this.outgoing_layer.Activation(this.public_memory.outputs);
    }

    return this.public_memory.outputs;
  }

  Propagate(outputs = []) {
    this.recurrent && transform.propagate(this, outputs, this.recurrent);
    transform.propagate(this, outputs);

    if (this.incoming_layer) {
      this.incoming_layer.Propagate();
    }
  }
}

export default Layer;
