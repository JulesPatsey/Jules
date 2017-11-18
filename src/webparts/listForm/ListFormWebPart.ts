import * as React from 'react';
import * as ReactDom from 'react-dom';
import { DisplayMode, Environment, EnvironmentType, Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'ListFormWebPartStrings';
import ListForm from './components/ListForm';
import { IListFormProps } from './components/IListFormProps';
import { IListFormWebPartProps } from './IListFormWebPartProps';
import { IFieldConfiguration } from './components/IFieldConfiguration';

import { PropertyPaneAsyncDropdown } from '../../controls/PropertyPaneAsyncDropdown/PropertyPaneAsyncDropdown';
import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import ConfigureWebPart from '../../common/components/ConfigureWebPart';
import { update, get } from '@microsoft/sp-lodash-subset';

import { ListService } from '../../common/services/ListService';
import { ControlMode } from '../../common/datatypes/ControlMode';


export default class ListFormWebPart extends BaseClientSideWebPart<IListFormWebPartProps> {

  private listService: ListService;
  private cachedLists = null;

  public render(): void {

    let itemId;
    if (this.properties.itemId) {
      itemId = Number(this.properties.itemId);
      if (isNaN(itemId)) {
        const urlParams = new URLSearchParams(window.location.search);
        itemId = Number(urlParams.get(this.properties.itemId));
      }
    }

    let element;
    if (Environment.type === EnvironmentType.Local) {
      element = React.createElement( MessageBar, {messageBarType: MessageBarType.blocked},
        strings.LocalWorkbenchUnsupported
      );
    } else if (this.properties.listUrl) {
      element = React.createElement(
        ListForm,
        {
          inDesignMode: this.displayMode === DisplayMode.Edit ,
          spContext: this.context,
          title: this.properties.title,
          description: this.properties.description,
          listUrl: this.properties.listUrl,
          formType: this.properties.formType,
          id: itemId,
          fields: this.properties.fields,
          showUnsupportedFields: this.properties.showUnsupportedFields,
          onSubmitSucceeded: (id: number) => this.formSubmitted(id),
          onUpdateFields: (fields: IFieldConfiguration[]) => this.updateField(fields),
        }
      );
    } else {
      element = ConfigureWebPart(
          { webPartContext: this.context, title: this.properties.title, description: strings.MissingListConfiguration, buttonText: strings.ConfigureWebpartButtonText }
        );
    }

    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    return super.onInit().then( _ => {
      this.listService = new ListService(this.context.spHttpClient);
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const mainGroup = {
        groupName: strings.BasicGroupName,
        groupFields: [
          PropertyPaneTextField('title', {
            label: strings.TitleFieldLabel
          }),
          PropertyPaneTextField('description', {
            label: strings.DescriptionFieldLabel,
            multiline: true
          }),
          new PropertyPaneAsyncDropdown('listUrl', {
            label: strings.ListFieldLabel,
            loadOptions: this.loadLists.bind(this),
            onPropertyChange: this.onListChange.bind(this),
            selectedKey: this.properties.listUrl
          }),
          PropertyPaneDropdown('formType', {
            label: strings.FormTypeFieldLabel,
            options: Object.keys(ControlMode)
                             .map( (k) => ControlMode[k]).filter( (v) => typeof v === 'string' )
                               .map( (n) => ({key: ControlMode[n], text: n}) ),
            disabled: !this.properties.listUrl
          }),

        ]
      };
    if (this.properties.formType !== ControlMode.New) {
      mainGroup.groupFields.push(
        PropertyPaneTextField( 'itemId', {
          label: strings.ItemIdFieldLabel,
          deferredValidationTime: 2000,
          description: strings.ItemIdFieldDescription
        }));
    }
    mainGroup.groupFields.push(
      PropertyPaneToggle('showUnsupportedFields', {
        label: strings.ShowUnsupportedFieldsLabel,
        disabled: !this.properties.listUrl
      })
    );
    mainGroup.groupFields.push(
      PropertyPaneTextField('redirectUrl', {
        label: strings.RedirectUrlFieldLabel,
        description: strings.RedirectUrlFieldDescription,
        disabled: !this.properties.listUrl
      })
    );
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [mainGroup]
        }
      ]
    };
  }

  private loadLists(): Promise<IDropdownOption[]> {
    return new Promise<IDropdownOption[]>((resolve: (options: IDropdownOption[]) => void, reject: (error: any) => void) => {
      if (Environment.type === EnvironmentType.Local) {
        resolve( [{
            key: 'sharedDocuments',
            text: 'Shared Documents',
          },
          {
            key: 'someList',
            text: 'Some List',
          }] );
      } else if (Environment.type === EnvironmentType.SharePoint ||
                Environment.type === EnvironmentType.ClassicSharePoint) {
        try {
          if (!this.cachedLists) {
            return this.listService.getListsFromWeb(this.context.pageContext.web.absoluteUrl)
              .then( (lists) => {
                this.cachedLists = lists.map( (l) => ({ key: l.url, text: l.title } as IDropdownOption) );
                resolve( this.cachedLists );
              } );
          } else {
            return resolve( this.cachedLists );
          }
        } catch (error) {
          // set a new state conserving the previous state + the new error
          alert( 'Error on loading lists: ' + error );
        }
      }
    });
  }

  private onListChange(propertyPath: string, newValue: any): void {
    const oldValue: any = get(this.properties, propertyPath);
    if (oldValue !== newValue) {
      this.properties.fields = null;
    }
    // store new value in web part properties
    update( this.properties, propertyPath, (): any => newValue );
    // refresh property Pane
    this.context.propertyPane.refresh();
    // refresh web part
    this.render();
  }


  private updateField(fields: IFieldConfiguration[]): any {
    this.properties.fields = fields;
    this.render();
  }

  private formSubmitted(id: number) {
    if (this.properties.redirectUrl) {
      window.location.href = this.properties.redirectUrl.replace('[ID]', id.toString() );
    }
  }




}
