import * as React from 'react';
import pnp from "sp-pnp-js";
import * as _ from "lodash";
import { SearchQuery, SearchResults, SearchResult } from "sp-pnp-js";
import { css } from 'office-ui-fabric-react';
import styles from './PropertyBagDisplay.module.scss';
import { IPropertyBagDisplayProps } from './IPropertyBagDisplayProps';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { Button, ButtonType } from 'office-ui-fabric-react/lib/Button';
import {
  DetailsList, DetailsListLayoutMode, IColumn, SelectionMode, CheckboxVisibility,
} from "office-ui-fabric-react/lib/DetailsList";
import {
  Dialog, DialogType
} from "office-ui-fabric-react/lib/Dialog";
import { IContextualMenuItem, } from 'office-ui-fabric-react/lib/ContextualMenu';
export interface IPropertyBagDisplayState {
  selectedIndex: number;

  messsage?: string;
  isediting?: boolean;
  sites: Array<any>;
  workingStorage?: DisplaySite
}
export class DisplaySite {
  constructor(
    public name: string, public url: string, public SiteTemplate: string
  ) { }
}
export default class PropertyBagDisplay extends React.Component<IPropertyBagDisplayProps, IPropertyBagDisplayState> {
  public constructor() {
    super();
    this.state = { sites: [], selectedIndex: -1 };

  }
  /**Accessors */
  get CommandItems(): Array<IContextualMenuItem> {
    debugger;
    return [
      {
        key: "a",
        name: "Edit",
        disabled: !(this.ItemIsSelected),
        title: "Edit",
        onClick: this.onEditItemClicked.bind(this),
        icon: "Edit"
      }];
  };

  get ItemIsSelected(): boolean {
    if (!this.state) { return false; }
    return (this.state.selectedIndex != -1);
  }
  /** react lifecycle */
  public componentWillMount() {
    const displayProps: Array<string> = this.props.propertiesToDisplay.split("\n").map(item=>{
      return item.split('|')[1];
    });
    displayProps.unshift("Title");
    displayProps.unshift("Url");
    displayProps.unshift("SiteTemplate");
    displayProps.unshift("SiteTemplateId");
    //search contentclass:STS_Site
    const q: SearchQuery = {
      Querytext: "contentclass:STS_Site",
      SelectProperties: displayProps,
      RowLimit: 999,
      TrimDuplicates: false

    };

    pnp.sp.search(q).then((results: SearchResults) => {
      debugger;
      for (const r of results.PrimarySearchResults) {
        let obj: any = {};

        for (const dp of displayProps) {
          obj[dp] = r[dp];
        }
        obj.SiteTemplate = obj.SiteTemplate + "#" + obj.SiteTemplateId;

        this.state.sites.push(obj);
      }

      this.setState(this.state);
    });
  }
  public stopediting() {
    this.state.isediting = false;
    this.setState(this.state);
  }
  public onActiveItemChanged(item?: any, index?: number) {
    debugger;
    this.state.selectedIndex = index;
    this.setState(this.state);
  }
  private setSPProperty(name: string, value: string, siteUrl: string) { // SHARED CODE
    return new Promise((resolve, reject) => {
      var webProps;
      var clientContext = new SP.ClientContext(siteUrl);
      var web = clientContext.get_web();
      webProps = web.get_allProperties();
      webProps.set_item(name, value);
      web.update();
      webProps = web.get_allProperties();
      clientContext.load(web);
      clientContext.load(webProps);
      clientContext.executeQueryAsync((s, a) => { resolve(); }, (s, a) => { reject(); });

    });
  }
  public onSave(e?: MouseEvent): void {
    //  this.setSPProperty(this.state.workingStorage.name, this.state.workingStorage.value,this.state.wor)
    //    .then(value => {
    //     //  this.changeSearchable(this.state.workingStorage.name, this.state.workingStorage.searchable)
    //     //    .then(s => {
    //     //      this.state.displayProps[this.state.selectedIndex] = this.state.workingStorage;
    //     //      this.state.workingStorage = null;
    //     //      this.state.isediting = false;
    //     //      this.setState(this.state);
    //     //    });
    //    });
  }
  public onCancel(e?: MouseEvent): void {
    this.state.isediting = false;
    this.state.workingStorage = null;
    this.setState(this.state);
  }
  // public onSearchableValueChanged(newValue: boolean) {
  //   this.state.workingStorage.searchable = newValue;
  //   this.setState(this.state);
  // }
  public onEditItemClicked(e?: MouseEvent): void {
    this.state.isediting = true;
    this.state.workingStorage = _.clone(this.state.sites[this.state.selectedIndex]);
    this.setState(this.state);
  }
  public render(): React.ReactElement<IPropertyBagDisplayProps> {
    debugger;
    const columns: Array<IColumn> = [
      {
        fieldName: "SiteTemplate",
        key: "SiteTemplate",
        name: "SiteTemplate",
        minWidth: 20,
        maxWidth: 220,
      },

      {
        fieldName: "Title",
        key: "Title",
        name: "Title",
        minWidth: 20,
        maxWidth: 220,
      },
      {
        fieldName: "Url",
        key: "Url",
        name: "Url",
        minWidth: 20,
        maxWidth: 220,
      },

    ]
   const displayProps: Array<string> = this.props.propertiesToDisplay.split("\n").map(item=>{
      return item.split('|')[1];
    });
     for (const dp of displayProps) {
      columns.push(
        {
          fieldName: dp,
          key: dp,
          name: dp,
          minWidth: 20,
          maxWidth: 220,

        })
    }

    return (
      <div>
        <CommandBar items={this.CommandItems} />
        <DetailsList
          items={this.state.sites}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          columns={columns}
          selectionMode={SelectionMode.single}
          checkboxVisibility={CheckboxVisibility.hidden}
          onActiveItemChanged={this.onActiveItemChanged.bind(this)}
        >
        </DetailsList>
        <Dialog
          isOpen={this.state.isediting} type={DialogType.close}
          onDismiss={this.stopediting.bind(this)}
          title={(this.state.workingStorage) ? this.state.workingStorage.name : ""}        >

          <span> <Label>Site Url</Label> {(this.state.workingStorage) ? this.state.workingStorage.url : ""}</span>

          {/*<TextField
            value={(this.state.workingStorage) ? this.state.workingStorage.value : ""}
            onBlur={this.onSPPropertyValueChanged.bind(this)}
          />*/}



          {/*<Toggle label="Searchable"
            checked={(this.state.workingStorage) ? this.state.workingStorage.searchable : undefined}
            onChanged={this.onSearchableValueChanged.bind(this)}
          />*/}


          <Button default={true} icon="Save" buttonType={ButtonType.icon} value="Save" onClick={this.onSave.bind(this)} >Save</Button>
          <Button icon="Cancel" buttonType={ButtonType.icon} value="Cancel" onClick={this.onCancel.bind(this)} >Cancel</Button>


        </Dialog>
      </div>
    );
  }
}
