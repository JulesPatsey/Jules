export class Site {
     public constructor(public id: string,
        public title: string,
        public url: string) {

        this.lists = new Array<WebList>();
    }
}
