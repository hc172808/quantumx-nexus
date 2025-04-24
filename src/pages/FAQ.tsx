
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>General Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Quantum Network?</AccordionTrigger>
              <AccordionContent>
                Quantum Network is a next-generation blockchain platform that combines quantum-resistant cryptography with traditional blockchain features, allowing users to create and trade tokens, set up nodes, and participate in prediction games.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How does quantum protection work?</AccordionTrigger>
              <AccordionContent>
                Our quantum protection uses post-quantum cryptographic algorithms that are resistant to attacks from quantum computers. This ensures your assets and transactions will remain secure even as quantum computing technology advances.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Wallet Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-3">
              <AccordionTrigger>How do I recover my wallet if I lose access?</AccordionTrigger>
              <AccordionContent>
                You can recover your wallet using the 12-word recovery phrase that was created when you first set up your wallet. Go to the login page and select "Restore Wallet" to enter your recovery phrase.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Can I export my private keys?</AccordionTrigger>
              <AccordionContent>
                Yes, you can export your private keys from the wallet settings page. However, we strongly recommend keeping your private keys secure and never sharing them with anyone.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Is my recovery phrase stored on your servers?</AccordionTrigger>
              <AccordionContent>
                No, your recovery phrase is never stored on our servers. It is encrypted and stored locally on your device. This means you must back it up yourself in a secure location.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Token Creation & Trading</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-6">
              <AccordionTrigger>How do I create a new token?</AccordionTrigger>
              <AccordionContent>
                Navigate to the Token Creation page, fill in the required details including name, symbol, initial supply, and token features. You'll need to provide liquidity by pairing your token with an existing token or coin. Once confirmed, your token will be created on the network.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger>Why do I need to provide liquidity for my token?</AccordionTrigger>
              <AccordionContent>
                Liquidity is essential for allowing users to trade your token. By pairing your token with another token or coin, you create a market for it, enabling others to buy and sell it at a fair market price.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger>Can I use the same name or symbol as another token?</AccordionTrigger>
              <AccordionContent>
                No, token names and symbols must be unique on the Quantum Network. This prevents confusion and potential scams. The system will automatically check for uniqueness during the creation process.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Node Operation</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-9">
              <AccordionTrigger>What types of nodes can I run?</AccordionTrigger>
              <AccordionContent>
                You can run three types of nodes: validator nodes (which participate in consensus), full nodes (which store the complete blockchain), and light nodes (which only store headers and rely on full nodes for data).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10">
              <AccordionTrigger>How do main nodes and slave nodes work together?</AccordionTrigger>
              <AccordionContent>
                Main nodes coordinate with slave nodes to ensure network consistency. All nodes must have the same information before a transaction is confirmed. This distributed consensus mechanism ensures security and reliability of the network.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Prediction Game & Features</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-11">
              <AccordionTrigger>How does the prediction game work?</AccordionTrigger>
              <AccordionContent>
                The prediction game allows you to predict whether a token's price will go up or down within a selected timeframe. If your prediction is correct, you earn rewards based on the multiplier. Select a token, choose a direction and timeframe, and place your prediction amount.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-12">
              <AccordionTrigger>How can I customize the app's theme?</AccordionTrigger>
              <AccordionContent>
                You can select your preferred theme from the Theme Selector in the app header. If the admin has enabled theme customization, you'll see various theme options like Light, Dark, and other custom themes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FAQ;
