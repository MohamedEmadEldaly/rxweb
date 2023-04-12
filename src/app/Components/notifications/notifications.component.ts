import { Component, OnInit } from '@angular/core';
import axios from 'types-axios';
import { environment as env } from '../../../environments/environment';
import { ToastService } from 'src/app/core/_services/toast.service';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  isLoaderShow: boolean=  true;
  constructor(public ToastService: ToastService) { }
  welcomeImage: boolean= true;
  upcomingDetails: boolean= false;
  noDataFound:boolean = false;
  pageNumber = 1;
  accessToken:any;
  selectedItem: any;
  searchKeyword:any='';

  apiUrl = environment.apiUrl;

  ngOnInit(): void {
    this.accessToken = this.getCookieDisclaimer("userToken");
    // this.getNotificationList()
    document.querySelector(".doctor-assistant")?.classList.add("d-none");
    this.getNotificationList(this.searchKeyword, this.pageNumber);
    setTimeout(()=>{
      this.getNextPageList()
    }, 100)
  }
  notificationList=[{
    ar_body: "تم الغاء الحجز",
en_body: "appointment has canceled",
id: "24cc7986-a5e6-4b92-8f77-8eb3a359cada",
object_id: 7


  }];
  appointmentTypeClass(typeId: any) {
    if (typeId == 1) {
      return 'regular'
    } else if (typeId == 2) {
      return "urgent"
    } else if (typeId == 2) {
      return "home-visit"
    } else if (typeId == 4) {
      return "video-Consult"
    } else {
      return "Consult"
    }

  }
  getCookieDisclaimer(cookiesName: any) {
    let name = cookiesName + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
  appointmentType(typeId: any) {
    if(typeId == 1) {
      return 'Regular'
    } else if(typeId == 2) {
      return "Urgent"
    }else if(typeId == 2) {
      return "Home Visit"
    }else if(typeId == 4) {
      return "Video Consult"
    } else {
       return "Consult"
    }

  }
  getNotificationList(keyword: any, pageNumber:any){
    this.noDataFound = false;
    this.isLoaderShow = true;
    this.ajaxFinishLoading = false;
    if(pageNumber == 1) {
      this.notificationList = []

    }
    // this.welcomeImage = true;   // it will return after add prescription
    // this.upcomingDetails = false;
    // this.selectedAppointmentDetail={}

    axios({
      url: `${this.apiUrl}doctor_notifications?page=${pageNumber}`,
      method: "GET",
      headers: {
        'Authorization': "Bearer " + this.accessToken,

      },
    }).then((res) => {
      ////console.log("resssoooopse msg notificationList", res.data.data);
    //debugger

      this.isLoaderShow = false;
      this.pageNumber++;
      this.ajaxFinishLoading = true;
      this.notificationList = this.notificationList.concat(res.data.data);
      if(this.notificationList.length == 0) {
        this.noDataFound = true;
        document.querySelector('.oberver-item')?.classList.add("d-none");

      } else {
        this.noDataFound = false;
        document.querySelector('.oberver-item')?.classList.remove("d-none");
      }

      if(res.data.data.length == 0) {
        this.isThereItems = false;
      }
    }).catch((error) => {
      this.showSuccess(error.response.data.errors[0]);
      this.isLoaderShow = false;

      // ////console.log("errrorrrrrrrrr", error.response.data.errors[0], error, error.data)
    });


  }
  showSuccess(msg: string) {
    this.ToastService.show(msg, { classname: 'bg-success text-light', delay: 8000 });
  }
  isThereItems:boolean= true;
  ajaxFinishLoading:boolean = true;
  getNextPageList(){
    //start Observer
    ////console.log("i aaaaaaaaaaaaaaam heeeeeeeeeeeeereeee ouside ");
    var observer = new IntersectionObserver(entries => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         if (this.isThereItems == true && this.ajaxFinishLoading) {
           //debugger
           setTimeout(() => {
             ////console.log("i aaaaaaaaaaaaaaam heeeeeeeeeeeeereeee");
             // this.getPatientsList(this.clinicId, this.searchInput.nativeElement.value);

               this.getNotificationList(this.searchKeyword, this.pageNumber);


           }, 500);
         }
       }
     });
   });
   // const container = document.querySelector(".main-footer");
   const container = document.querySelector(".oberver-item");
   if(container != null) {
     observer.observe(container);
   }
 }

}
