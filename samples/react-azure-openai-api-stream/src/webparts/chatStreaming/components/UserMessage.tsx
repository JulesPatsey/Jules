import { IconButton, Stack, TextField } from '@fluentui/react';
import * as React from 'react';

export interface IUserMessageProps {
    onMessageChange: (query: string) => void;
    sendQuery: () => Promise<void>;
    controller: AbortController;
    textFieldValue: string;
}

export default class UserMessage extends React.Component<IUserMessageProps, {}> {
  private _onChange = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newText: string
  ): void => {
    this.props.onMessageChange(newText);
  };

  private _handleClick = async (): Promise<void> => {
    await this.props.sendQuery();
  };


  private _keyDownHandler = async (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): Promise<void> => {
    if(!event.shiftKey && event.key === "Enter") {
      //Submits message when a user hits return (but still allows newlines for shift+enter)
      event.preventDefault();
      return this._handleClick();
    }
  };

  public render(): React.ReactElement<IUserMessageProps> {
    return (
      <Stack horizontal tokens={{ childrenGap: 5 }}>
        <Stack.Item grow={1}>
          <TextField
            multiline
            autoAdjustHeight
            value={this.props.textFieldValue}
            onChange={this._onChange}
            onKeyDown={this._keyDownHandler}
            label="User message"
            placeholder="Type user query here."
          />
        </Stack.Item>
        <Stack.Item align="end">
          <IconButton
            iconProps={{ iconName: "Send" }}
            title="Send"
            ariaLabel="Send"
            onClick={this._handleClick}
          />
          <IconButton
            iconProps={{ iconName: 'Stop' }}
            title="Stop generating"
            ariaLabel="Stop"
            onClick={() => this.props.controller.abort()}
          />
        </Stack.Item>
      </Stack>
    );
  }
}