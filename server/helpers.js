const consolesBuffer = require("./consolesBuffer");

const prepareConsoleValue = (args) => {
  let result = "";

  args.forEach((argEl) => {
    if (Array.isArray(argEl)) {
      result += `${JSON.stringify(argEl)} `;

      return;
    }

    result += `${argEl} `;
  });

  return result;
};

module.exports = {
  createConsoleBufferElement: (args, type) => {
    const preparedValue = prepareConsoleValue(args);

    return { type, value: preparedValue };
  },
  getScriptContext: () => {
    return {
      setTimeout,
      console: {
        log: (...args) => {
          const message = module.exports.createConsoleBufferElement(
            [...args],
            "info"
          );

          consolesBuffer.add(message);
        },
        warn: (...args) => {
          const message = module.exports.createConsoleBufferElement(
            [...args],
            "warn"
          );

          consolesBuffer.add(message);

          console.warn(...args);
        },
        error: (...args) => {
          const message = module.exports.createConsoleBufferElement(
            [...args],
            "error"
          );

          consolesBuffer.add(message);

          console.error(...args);
        },
      },
    };
  },
};
