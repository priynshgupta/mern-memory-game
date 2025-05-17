// Validate environment variables
const validateEnv = () => {
  const requiredVars = ['MONGO_URI', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error(`Error: Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
  }

  console.log('All required environment variables are set');
  return true;
};

module.exports = validateEnv;
