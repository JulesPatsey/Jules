import * as React from 'react';
import styles from './FluentUi9Demo.module.scss';
import { IFluentUi9DemoProps } from './IFluentUi9DemoProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Button, Link, Text, Caption, Body, Avatar, useId, ToggleButton, Slider, Menu, MenuTrigger, MenuButtonProps, MenuPopover, MenuList, MenuItem, SplitButton, Divider } from '@fluentui/react-components';
import { Card, Tab, TabList, CardHeader, CardPreview, CardFooter, Label, Input, Checkbox, RadioGroup, Radio, Switch } from '@fluentui/react-components/unstable';
import { ArrowReplyRegular, ShareRegular, DocumentText24Regular } from '@fluentui/react-icons';

export default function FluentUi9Demo(props: IFluentUi9DemoProps) {
  const { isDarkTheme, environmentMessage, hasTeamsContext, userDisplayName } = props;
  const [tab, setTab] = React.useState<string | unknown>("buttons");
  const [me, setMe] = React.useState<string|undefined>();
  const outlineId = useId('input-outline');
  const underlineId = useId('input-underline');

  React.useEffect(() => {
    props.context.msGraphClientFactory.getClient().then(async (client) => {
      await client
          .api('/me/photo/$value')
          .responseType("blob")
          .get()
          .then((blob: Blob) : Promise<any> => {
            return new Promise(resolve => {
              const url = URL.createObjectURL(blob);
              setMe(url);
              resolve(url);
            });
          });
        });
  }, []);

  return (
    <section className={`${styles.fluentUi9Demo} ${hasTeamsContext ? styles.teams : ''}`}>
      <div className={styles.welcome}>
        <img alt="" src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} className={styles.welcomeImage} />
        <h2>Well done, {escape(userDisplayName)}!</h2>
        <div>{environmentMessage}</div>
      </div>
      <div>
        <h3>Welcome to SharePoint Framework!</h3>
        <p>
          This demos the use of Fluent UI 9 instead of using FabircUI.  The new framework combines Northstar and FluentUI.  Below are some demo's and they should render in Teams style when inside Teams.
        </p>
        <Text as="h3">Demo components</Text>
        <div className={styles.stack}>
          <TabList onTabSelect={(e, data) => setTab(data.value)} defaultSelectedValue="buttons">
            <Tab value="buttons">Buttons</Tab>
            <Tab value="cards">Cards</Tab>
            <Tab value="inputs">Inputs</Tab>
          </TabList>
          {tab === 'buttons' && <div className={styles.stack} style={{padding: 10}}>
            <Divider appearance='brand'>Button</Divider>
            <div className={`${styles.stackHoz} ${styles.spaceBetween}`}>
              <Button>Default</Button><Button appearance="primary">Primary</Button><Button appearance="outline">Outline</Button><Button appearance="subtle">Subtle</Button><Button appearance="transparent">Transparent</Button>
            </div>
            <Divider appearance='brand'>Toggle Button</Divider>
            <div className={`${styles.stackHoz} ${styles.spaceBetween}`}>
              <ToggleButton>Default</ToggleButton>
              <ToggleButton appearance="primary">Primary</ToggleButton>
              <ToggleButton appearance="outline">Outline</ToggleButton>
              <ToggleButton appearance="subtle">Subtle</ToggleButton>
              <ToggleButton appearance="transparent">Transparent</ToggleButton>
            </div>
            <Divider appearance='brand'>Split Button</Divider>
            <div className={`${styles.stackHoz} ${styles.spaceBetween}`}>
              <Menu positioning="below-end">
                <MenuTrigger>
                  {(triggerProps: MenuButtonProps) => <SplitButton menuButton={triggerProps}>Default</SplitButton>}
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    <MenuItem>Item a</MenuItem>
                    <MenuItem>Item b</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>

              <Menu positioning="below-end">
                <MenuTrigger>
                  {(triggerProps: MenuButtonProps) => (
                    <SplitButton menuButton={triggerProps} appearance="primary">
                      Primary
                    </SplitButton>
                  )}
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    <MenuItem>Item a</MenuItem>
                    <MenuItem>Item b</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>

              <Menu positioning="below-end">
                <MenuTrigger>
                  {(triggerProps: MenuButtonProps) => (
                    <SplitButton menuButton={triggerProps} appearance="outline">
                      Outline
                    </SplitButton>
                  )}
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    <MenuItem>Item a</MenuItem>
                    <MenuItem>Item b</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>

              <Menu positioning="below-end">
                <MenuTrigger>
                  {(triggerProps: MenuButtonProps) => (
                    <SplitButton menuButton={triggerProps} appearance="subtle">
                      Subtle
                    </SplitButton>
                  )}
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    <MenuItem>Item a</MenuItem>
                    <MenuItem>Item b</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>

              <Menu positioning="below-end">
                <MenuTrigger>
                  {(triggerProps: MenuButtonProps) => (
                    <SplitButton menuButton={triggerProps} appearance="transparent">
                      Transparent
                    </SplitButton>
                  )}
                </MenuTrigger>

                <MenuPopover>
                  <MenuList>
                    <MenuItem>Item a</MenuItem>
                    <MenuItem>Item b</MenuItem>
                  </MenuList>
                </MenuPopover>
              </Menu>
            </div>
          </div>}
          {tab === 'cards' && <>
            <Card>
              <CardHeader
                image={<Avatar name={userDisplayName} image={me ? {src: me } : null} />}
                header={
                  <Body>
                    <b>{userDisplayName}</b> mentioned
                  </Body>
                }
                description={<Caption>5h ago · About us - Overview</Caption>}
              />

              <CardPreview logo={<DocumentText24Regular />}>
                <img src={isDarkTheme ? require('../assets/welcome-dark.png') : require('../assets/welcome-light.png')} alt="Preview of a Word document " />
              </CardPreview>
              <CardFooter>
                <Button icon={<ArrowReplyRegular fontSize={16} />}>Reply</Button>
                <Button icon={<ShareRegular fontSize={16} />}>Share</Button>
              </CardFooter>
            </Card>
          </>}
          {tab === 'inputs' && <div style={{padding: 10}} className={styles.stack}>
            <div><Label htmlFor={outlineId}>Outline (default)</Label><Input appearance="outline" id={outlineId} /></div>
            <div><Label htmlFor={underlineId}>Underline</Label><Input appearance="underline" id={underlineId} /></div>
            <Checkbox label="Option 1" /><Checkbox label="Option 2" checked /><Checkbox label="Option 3" checked="mixed" />
            <RadioGroup layout="horizontal"><Radio value="A" label="Option A" /><Radio value="B" label="Option B" /><Radio value="C" label="Option C" /><Radio value="D" label="Option D" /></RadioGroup>
            <Switch />
            <Slider defaultValue={20} />
          </div>}
        </div>
        <h4>Learn more about SPFx development:</h4>
        <ul className={styles.links}>
          <li><Link href="https://aka.ms/spfx" target="_blank">SharePoint Framework Overview</Link></li>
          <li><Link href="https://aka.ms/spfx-yeoman-graph" target="_blank">Use Microsoft Graph in your solution</Link></li>
          <li><Link href="https://aka.ms/spfx-yeoman-teams" target="_blank">Build for Microsoft Teams using SharePoint Framework</Link></li>
          <li><Link href="https://aka.ms/spfx-yeoman-viva" target="_blank">Build for Microsoft Viva Connections using SharePoint Framework</Link></li>
          <li><Link href="https://aka.ms/spfx-yeoman-store" target="_blank">Publish SharePoint Framework applications to the marketplace</Link></li>
          <li><Link href="https://aka.ms/spfx-yeoman-api" target="_blank">SharePoint Framework API reference</Link></li>
          <li><Link href="https://aka.ms/m365pnp" target="_blank">Microsoft 365 Developer Community</Link></li>
          <li><Link href="https://aka.ms/fluentui-storybook" target="_blank">Microsoft Fluent UI v9</Link></li>
        </ul>
      </div>
    </section>
  );
}