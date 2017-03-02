import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'propertyBagGlobalNavStrings';
import PropertyBagGlobalNav from './components/PropertyBagGlobalNav';
import { IPropertyBagGlobalNavProps } from './components/IPropertyBagGlobalNavProps';
import { IPropertyBagGlobalNavWebPartProps } from './IPropertyBagGlobalNavWebPartProps';

export default class PropertyBagGlobalNavWebPart extends BaseClientSideWebPart<IPropertyBagGlobalNavWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPropertyBagGlobalNavProps> = React.createElement(
      PropertyBagGlobalNav,
      {
        description: this.properties.description,
        managedProperties: this.properties.managedProperties,
        siteTemplatesToInclude: this.properties.siteTemplatesToInclude,
        filters: this.properties.filters,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField("filters", {
                  label: strings.FiltersFieldLabel,
                  description: strings.FiltersFieldDescription,
                  multiline: true,
                  resizable: true
                }),
                PropertyPaneTextField("siteTemplatesToInclude", {
                  label: strings.SiteTemplatesToIncludeFieldLabel,
                  description: strings.SiteTemplatesToIncludeFieldDescription,
                  multiline: true,
                  resizable: true

                }),
                PropertyPaneTextField("managedProperties", {
                  label: strings.ManagedPropertiesFieldLabel,
                  description: strings.ManagedPropertiesFieldDescription,
                  multiline: true,
                  resizable: true
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
