import { Component, Inject, Input, OnInit, ViewChild , ElementRef, AfterViewInit, Output ,EventEmitter  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { debounceTime, Subject } from 'rxjs';


@Component({
  selector: 'app-advancelookup',
  templateUrl: './advancelookup.component.html',
  styleUrls: ['./advancelookup.component.scss']
})
export class AdvancelookupComponent implements OnInit {

  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
    this.filteredOptions = this.filteredOptions.map((x:any,i:number) => {
      return {
        ...x,
        id:i,
        selected : false
      }
    })
  }

  // filteredOptions = [
  //   {
  //     name:"Ather AHmed",
  //     email:"atherfar@gmail.com",
  //     username:"atherAhm",
  //     selected:false
  //   },
  //   {
  //     name:"AHmed nashith",
  //     email:"anasht@gmail.com",
  //     username:"nashtAhm",
  //     selected:false
  //   },
  //   {
  //     name:"md sarfaraz",
  //     email:"sarfarzar@gmail.com",
  //     username:"sompraj",
  //     selected:false
  //   },
  //   {
  //     name:"Ather AHmed",
  //     email:"atherfar@gmail.com",
  //     username:"atherAhm",
  //     selected:false
  //   },
  //   {
  //     name:"AHmed nashith",
  //     email:"anasht@gmail.com",
  //     username:"nashtAhm",
  //     selected:false
  //   },
  //   {
  //     name:"md sarfaraz",
  //     email:"sarfarzar@gmail.com",
  //     username:"sompraj",
  //     selected:false
  //   },
    
  // ];
  //   headerObj = [
  //     {
  //       id:1,
  //       name:"Name",
  //       attr:"name"
  //     },
  //     {
  //       id:2,
  //       name:"Email",
  //       attr:"email"
  //     },
  //     {
  //       id:3,
  //       name:"User Name",
  //       attr:"userName"
  //     }
  // ];
  @Input() filteredOptions!:any[];
  @Input() inputVal!:string;
  @Input() headerObj!:any[]
  @Input() advanceLookup !: boolean ;
  @Output() searchText = new EventEmitter<string>();
  @Output() loadPage = new EventEmitter<number>();
  @Input() pageNo!:number;
  openLookup(){
    let dialogref = this.dialog.open(LookupPopup,{
      width:"900px",
      height:"400px",
      disableClose:true,
      data:[this.filteredOptions,this.headerObj,this.pageNo]
    });
    dialogref.componentInstance.$load.subscribe(page => {
      // emit event page
      this.loadPage.emit(page);
    });
    dialogref.componentInstance.$search.pipe(debounceTime(2000)).subscribe(search => {
      //emit search text
      this.searchText.emit(search);
    });
  } 
}

@Component({
  selector:"app-lookup-popup",
  templateUrl:'./lookup-popup.html'
})

export class LookupPopup implements OnInit,AfterViewInit{
  
  constructor( @Inject(MAT_DIALOG_DATA) public data:any ,public dialog:MatDialogRef<LookupPopup>){}

  headers!:any[];
  tabledata!:any[];
  $load:Subject<number> = new Subject();
  $search:Subject<string> = new Subject();
  page!:number;

  @ViewChild('loader',{ read: ElementRef }) loader!:ElementRef
  ngOnInit(): void { 
      [this.tabledata,this.headers,this.page] = this.data;
      console.log(this.tabledata,this.headers);
  }
  ngAfterViewInit(): void {
      console.log(this.loader.nativeElement);
      const intrsc = new IntersectionObserver(val => {
        if(val[0].isIntersecting){
          /// load 
          this.$load.next(this.page++);
          console.log("pageNo",this.page);
          this.tabledata.push(...this.tabledata);
          console.log(this.tabledata);
        }
      });
      intrsc.observe(this.loader.nativeElement);
  }

  srchTxt!:string
  emitSearch(){
    this.$search.next(this.srchTxt)
  }
  radioSelected(id:any){
    this.tabledata.map(val => {
      console.log(id != val.id,id != val.id)
      if(val.id != id){ 
        val.selected = false;
      }else if(val.id == id){
        val.selected = true;
      }
    });
    console.log(this.tabledata);
  }
}
