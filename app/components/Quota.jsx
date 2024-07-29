import React from 'react';
import { BlockStack, Box, Card, Text, ProgressBar } from '@shopify/polaris';

function Quota() {
    return (
        <Card roundedAbove="sm">
            <Text as="h1" variant="headingSm">Quota</Text>
            <Box paddingBlock="200">
                <BlockStack gap="200">
                    <Text as="h3" variant="headingSm" fontWeight="medium">
                        Storage
                    </Text>
                    <div style={{width: 225}}>
                        <ProgressBar progress={20} size="small" />
                    </div>
                </BlockStack>
            </Box>
            <Box paddingBlockStart="200">
                <BlockStack gap="200">
                    <Text as="h3" variant="headingSm" fontWeight="medium">
                        Submissions
                    </Text>
                    <div style={{width: 225}}>
                        <ProgressBar progress={20} size="small" />
                    </div>
                </BlockStack>
            </Box>
        </Card>
    );
}

export default Quota;