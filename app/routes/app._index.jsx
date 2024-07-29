import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useFetcher, Link } from "@remix-run/react";
import { Page, Layout, Text, Card, Button, BlockStack, Box, List, InlineStack, LegacyCard, Tabs, Grid, TextContainer, Icon } from "@shopify/polaris";
// import { HomeMinor, OrdersMinor, AnalyticsMinor } from '@shopify/polaris-icons';
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useNavigate } from "react-router-dom";
// import { Link } from "remix";
import Quota from '../components/Quota'

export const loader = async ({ request }) => {
    await authenticate.admin(request);
    return null;
};

export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);
    const color = ["Red", "Orange", "Yellow", "Green"][
        Math.floor(Math.random() * 4)
    ];
    const response = await admin.graphql(
        `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
        {
            variables: {
                input: {
                    title: `${color} Snowboard`,
                },
            },
        },
    );
    const responseJson = await response.json();
    const variantId =
        responseJson.data.productCreate.product.variants.edges[0].node.id;
    const variantResponse = await admin.graphql(
        `#graphql
        mutation shopifyRemixTemplateUpdateVariant($input: ProductVariantInput!) {
            productVariantUpdate(input: $input) {
                productVariant {
                    id
                    price
                    barcode
                    createdAt
                }
            }
        }`,
        {
            variables: {
                input: {
                    id: variantId,
                    price: Math.random() * 100,
                },
            },
        },
    );
    const variantResponseJson = await variantResponse.json();

    return json({
        product: responseJson.data.productCreate.product,
        variant: variantResponseJson.data.productVariantUpdate.productVariant,
    });
};

export default function Index() {
    const fetcher = useFetcher();
    const shopify = useAppBridge();
    const isLoading =
        ["loading", "submitting"].includes(fetcher.state) &&
        fetcher.formMethod === "POST";
    const productId = fetcher.data?.product?.id.replace(
        "gid://shopify/Product/",
        "",
    );

    useEffect(() => {
        if (productId) {
            shopify.toast.show("Product created");
        }
    }, [productId, shopify]);
    const generateProduct = () => fetcher.submit({}, { method: "POST" });

    const navigate = useNavigate();
    const handleCreateform = () => { navigate('/app/form_generator') };

    const [selected, setSelected] = useState(0);
    const handleTabChange = useCallback(
        (selectedTabIndex) => setSelected(selectedTabIndex),
        [],
    );
    const tabs = [
        {
            id: 'all-customers-fitted-2',
            content: 'Create Form',
            text: 'Create professional-looking forms with no coding. Easily adapt our pre-designed form templates to suit your needs, ensuring a seamless fit for your requirements.',
            btnText: 'Create Form',
            accessibilityLabel: 'All customers',
            panelID: 'all-customers-fitted-content-2',
        },
        {
            id: 'accepts-marketing-fitted-2',
            content: 'Publish Form',
            text: 'Put your form to your Online Store within a minute',
            btnText: 'Publish Form',
            panelID: 'accepts-marketing-fitted-Ccontent-2',
        },
    ];

    return (
        <Page>
            <TitleBar title="CodeTasker Form Builder">
                <button variant="primary" onClick={generateProduct}>Generate a product</button>
            </TitleBar>
            <Grid>
                <Grid.Cell columnSpan={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                    <LegacyCard sectioned>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                            {/* <Icon source={HomeMinor} color="base" /> */}
                            <TextContainer>
                                <Text as="h1" variant="headingMd">App embed</Text>
                                <p>Visit 'Theme customizer' and 'App embeds' section. Please enable the CT Form Builder app in order to show your forms on your store</p>
                            </TextContainer>
                            <Button variant="primary">Theme Editor</Button>
                        </div>
                    </LegacyCard>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                    <LegacyCard sectioned>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                            {/* <Icon source={OrdersMinor} color="base" /> */}
                            <TextContainer>
                                <Text as="h1" variant="headingMd">Create new form</Text>
                                <p>Creating a new form with our app is easy and super-fun. Give it a try and make your store stand out!</p>
                            </TextContainer>
                            {/* <Button variant="primary" onClick={handleCreateform}>New Form</Button> */}
                            <Button variant="primary" onClick={handleCreateform}>New Form</Button>
                        </div>
                    </LegacyCard>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                    <LegacyCard sectioned>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                            {/* <Icon source={AnalyticsMinor} color="base" />    */}
                            <TextContainer>
                                <Text as="h1" variant="headingMd">Knowledgebase</Text>
                                <p>Looking for help or do you just want to get to know Form Builder app a little more? Knowledgebase is the right place for you.</p>
                            </TextContainer>
                            <Button variant="primary">Knowledgebase</Button>
                        </div>
                    </LegacyCard>
                </Grid.Cell>
            </Grid>
            {/* <Card>
                <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
                    <LegacyCard.Section>
                        <p>{tabs[selected].text}</p>
                        <Button variant="primary" onClick={handleCreateform}>{tabs[selected].btnText}</Button>
                    </LegacyCard.Section>
                </Tabs>
            </Card> */}
            <Quota />
        </Page>
    );
}


const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        textAlign: 'center',
        color: '#333',
    },
    cardContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '20px',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '5px',
        padding: '20px',
        width: '30%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    cardHeader: {
        margin: '0 0 10px 0',
        color: '#333',
    },
    cardText: {
        color: '#555',
    },
};

{/* <BlockStack gap="100">
                <Layout>
                    <Layout.Section>
                        <div style={styles.container}>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                                <Text as="h1" variant="headingMd">Welcome to the Form Builder</Text>
                            </div>
                            <div style={styles.cardContainer}>
                                <div style={styles.card}>
                                    <div style={styles.cardHeader}>Create New Form icon space</div>
                                    <div style={styles.cardText}>
                                        <h1 style={styles.cardHeader}>Create New Form</h1>
                                        <p style={styles.cardText}>Creating a new form with our app is easy and super fun. Give it a try and make your store stand out!</p>
                                        <Button onClick={handleClick} title="new form">New Form</Button>
                                    </div>
                                </div>
                                <div style={styles.card}>
                                    <div style={styles.cardHeader}>View Form icon space Image</div>
                                    <div style={styles.cardText}>
                                        <h1 style={styles.cardHeader}>View Forms</h1>
                                        <p style={styles.cardText}>preview your live and draft forms on this page. You are able to edit them, publish or take a look at responses.</p>
                                        <Button onClick={viewForm}>Forms</Button>
                                    </div>
                                </div>
                                <div style={styles.card}>
                                    <div style={styles.cardHeader}>knowledge image</div>
                                    <div style={styles.cardText}>
                                        <h1 style={styles.cardHeader}>Knowledge Base</h1>
                                        <p style={styles.cardText}>Looking for help or do you just want to know Form Builder app. Knowledgebase is the right place.</p>
                                        <Button onClick={knowledgeForm}>knowledge base</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Layout.Section>
                    <Layout.Section>
                        <ProductsCard />
                    </Layout.Section>
                </Layout>
            </BlockStack> */}


{/* <BlockStack gap="100">
                <Layout>
                    <Layout.Section>
                        <Card>
                            <BlockStack gap="500">
                                <BlockStack gap="200">
                                    <Text as="h2" variant="headingMd">
                                        Congrats on creating a new Shopify app 🎉
                                    </Text>
                                    <Text variant="bodyMd" as="p">
                                        This embedded app template uses{" "}
                                        <Link
                                            url="https://shopify.dev/docs/apps/tools/app-bridge"
                                            target="_blank"
                                            removeUnderline
                                        >
                                            App Bridge
                                        </Link>{" "}
                                        interface examples like an{" "}
                                        <Link url="/app/additional" removeUnderline>
                                            additional page in the app nav
                                        </Link>
                                        , as well as an{" "}
                                        <Link
                                            url="https://shopify.dev/docs/api/admin-graphql"
                                            target="_blank"
                                            removeUnderline
                                        >
                                            Admin GraphQL
                                        </Link>{" "}
                                        mutation demo, to provide a starting point for app
                                        development.
                                    </Text>
                                </BlockStack>
                                <BlockStack gap="200">
                                    <Text as="h3" variant="headingMd">
                                        Get started with products
                                    </Text>
                                    <Text as="p" variant="bodyMd">
                                        Generate a product with GraphQL and get the JSON output for
                                        that product. Learn more about the{" "}
                                        <Link
                                            url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
                                            target="_blank"
                                            removeUnderline
                                        >
                                            productCreate
                                        </Link>{" "}
                                        mutation in our API references.
                                    </Text>
                                </BlockStack>
                                <InlineStack gap="300">
                                    <Button loading={isLoading} onClick={generateProduct}>
                                        Generate a product
                                    </Button>
                                    {fetcher.data?.product && (
                                        <Button
                                            url={`shopify:admin/products/${productId}`}
                                            target="_blank"
                                            variant="plain"
                                        >
                                            View product
                                        </Button>
                                    )}
                                </InlineStack>
                                {fetcher.data?.product && (
                                    <>
                                        <Text as="h3" variant="headingMd">
                                            {" "}
                                            productCreate mutation
                                        </Text>
                                        <Box
                                            padding="400"
                                            background="bg-surface-active"
                                            borderWidth="025"
                                            borderRadius="200"
                                            borderColor="border"
                                            overflowX="scroll"
                                        >
                                            <pre style={{ margin: 0 }}>
                                                <code>
                                                    {JSON.stringify(fetcher.data.product, null, 2)}
                                                </code>
                                            </pre>
                                        </Box>
                                        <Text as="h3" variant="headingMd">
                                            {" "}
                                            productVariantUpdate mutation
                                        </Text>
                                        <Box
                                            padding="400"
                                            background="bg-surface-active"
                                            borderWidth="025"
                                            borderRadius="200"
                                            borderColor="border"
                                            overflowX="scroll"
                                        >
                                            <pre style={{ margin: 0 }}>
                                                <code>
                                                    {JSON.stringify(fetcher.data.variant, null, 2)}
                                                </code>
                                            </pre>
                                        </Box>
                                    </>
                                )}
                            </BlockStack>
                        </Card>
                    </Layout.Section>
                    <Layout.Section variant="oneThird">
                        <BlockStack gap="500">
                            <Card>
                                <BlockStack gap="200">
                                    <Text as="h2" variant="headingMd">
                                        App template specs
                                    </Text>
                                    <BlockStack gap="200">
                                        <InlineStack align="space-between">
                                            <Text as="span" variant="bodyMd">
                                                Framework
                                            </Text>
                                            <Link
                                                url="https://remix.run"
                                                target="_blank"
                                                removeUnderline
                                            >
                                                Remix
                                            </Link>
                                        </InlineStack>
                                        <InlineStack align="space-between">
                                            <Text as="span" variant="bodyMd">
                                                Database
                                            </Text>
                                            <Link
                                                url="https://www.prisma.io/"
                                                target="_blank"
                                                removeUnderline
                                            >
                                                Prisma
                                            </Link>
                                        </InlineStack>
                                        <InlineStack align="space-between">
                                            <Text as="span" variant="bodyMd">
                                                Interface
                                            </Text>
                                            <span>
                                                <Link
                                                    url="https://polaris.shopify.com"
                                                    target="_blank"
                                                    removeUnderline
                                                >
                                                    Polaris
                                                </Link>
                                                {", "}
                                                <Link
                                                    url="https://shopify.dev/docs/apps/tools/app-bridge"
                                                    target="_blank"
                                                    removeUnderline
                                                >
                                                    App Bridge
                                                </Link>
                                            </span>
                                        </InlineStack>
                                        <InlineStack align="space-between">
                                            <Text as="span" variant="bodyMd">
                                                API
                                            </Text>
                                            <Link
                                                url="https://shopify.dev/docs/api/admin-graphql"
                                                target="_blank"
                                                removeUnderline
                                            >
                                                GraphQL API
                                            </Link>
                                        </InlineStack>
                                    </BlockStack>
                                </BlockStack>
                            </Card>
                            <Card>
                                <BlockStack gap="200">
                                    <Text as="h2" variant="headingMd">
                                        Next steps
                                    </Text>
                                    <List>
                                        <List.Item>
                                            Build an{" "}
                                            <Link
                                                url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                                                target="_blank"
                                                removeUnderline
                                            >
                                                {" "}
                                                example app
                                            </Link>{" "}
                                            to get started
                                        </List.Item>
                                        <List.Item>
                                            Explore Shopify’s API with{" "}
                                            <Link
                                                url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                                                target="_blank"
                                                removeUnderline
                                            >
                                                GraphiQL
                                            </Link>
                                        </List.Item>
                                    </List>
                                </BlockStack>
                            </Card>
                        </BlockStack>
                    </Layout.Section>
                </Layout>
            </BlockStack> */}