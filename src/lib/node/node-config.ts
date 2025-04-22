
export interface NodeConfig {
  id: string;
  type: 'validator' | 'full' | 'light';
  port: number;
  rpcEnabled: boolean;
  webInterface: boolean;
  status: 'enabled' | 'disabled';
}

const defaultConfig: NodeConfig = {
  id: 'node1',
  type: 'full',
  port: 8545,
  rpcEnabled: true,
  webInterface: true,
  status: 'enabled'
};

export const getNodeConfigs = () => {
  const configs = localStorage.getItem('nodeConfigs');
  return configs ? JSON.parse(configs) : [defaultConfig];
};

export const saveNodeConfig = (config: NodeConfig) => {
  const configs = getNodeConfigs();
  const index = configs.findIndex((c: NodeConfig) => c.id === config.id);
  
  if (index >= 0) {
    configs[index] = config;
  } else {
    configs.push(config);
  }
  
  localStorage.setItem('nodeConfigs', JSON.stringify(configs));
};

export const updateNodeStatus = (id: string, status: 'enabled' | 'disabled') => {
  const configs = getNodeConfigs();
  const config = configs.find((c: NodeConfig) => c.id === id);
  
  if (config) {
    config.status = status;
    localStorage.setItem('nodeConfigs', JSON.stringify(configs));
  }
};

export const generateLinuxSetupScript = (config: NodeConfig): string => {
  return `#!/bin/bash

# Install dependencies
sudo apt update
sudo apt install -y curl build-essential

# Create node directory
mkdir -p ~/quantum-node
cd ~/quantum-node

# Download node binary
curl -O https://quantum-node-binaries.example.com/latest

# Setup configuration
cat > config.json << EOL
{
  "nodeId": "${config.id}",
  "nodeType": "${config.type}",
  "port": ${config.port},
  "rpcEnabled": ${config.rpcEnabled},
  "webInterface": ${config.webInterface}
}
EOL

# Setup systemd service
sudo bash -c 'cat > /etc/systemd/system/quantum-node.service << EOL
[Unit]
Description=Quantum Node
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/quantum-node
ExecStart=/home/$USER/quantum-node/quantum-node
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOL'

# Start service
sudo systemctl daemon-reload
sudo systemctl enable quantum-node
sudo systemctl start quantum-node

echo "Node setup complete. Web interface available at http://localhost:${config.port}"
`;
};
