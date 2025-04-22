
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const NodeConfigGuide = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <div className="mx-auto mb-4 w-16 h-16 bg-quantum/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-quantum" />
          </div>
          <CardTitle className="text-center">Node Configuration Guide</CardTitle>
          <CardDescription className="text-center">
            Setting up and managing main and slave nodes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <section className="space-y-2">
              <h3 className="text-lg font-medium">Main Node Setup</h3>
              <p className="text-muted-foreground">
                Learn how to configure your main node, including security settings,
                network parameters, and performance optimization.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-medium">Slave Node Configuration</h3>
              <p className="text-muted-foreground">
                Understand how to set up and manage slave nodes, including synchronization,
                load balancing, and failover settings.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-lg font-medium">Network Architecture</h3>
              <p className="text-muted-foreground">
                Overview of node architecture, communication protocols, and best practices
                for maintaining a healthy node network.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NodeConfigGuide;
