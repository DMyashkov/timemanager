// globalSetup.js or globalSetup.ts

const originalLog = console.log;

console.log = (...args) => {
  const formattedArgs = args.map((arg) => {
    if (typeof arg === "object" && arg !== null) {
      return JSON.stringify(arg, null, 2); // Pretty-print JSON
    }
    return arg;
  });

  originalLog(...formattedArgs);
};
