import {Component, OnInit} from "@angular/core";
import {ActionSheetController, NavController} from "ionic-angular";
import {StanizerService} from "../../services/stanizer.service";
import {StoryDetailsPage} from "../storydetails/storydetails";
import {UserService} from "../../services/back-end/user.service";
import {StoryService} from "../../services/back-end/story.service";
import {NewStoryPage} from "../new-story/new-story";
import {User} from "../../dto/user";
import {UserStory} from "../../dto/user-story";
import {Album} from "../../dto/album";
import {Camera} from "@ionic-native/camera";
import {FileChooser} from "@ionic-native/file-chooser";


/* TEMPORARY IMPORT */

/**
 * More info on the slides management : https://ionicframework.com/docs/api/components/slides/Slides/
 */
@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html'
})
export class StoriesPage implements OnInit {

  public youtubeUrl: string = "www.youtube.com/embed/ERD4CbBDNI0?rel=0&amp;showinfo=0";
  public stanizedYoutubeUrl: any;


  public album1Data: Array<any> = [
    {id: "marieJosE-slide22", src: "assets/img/t/cHTUaigQQ2iFLSLC34OP_stadhuishalle.jpg"},
    {id: "marieJosE-slide29", src: "assets/img/t/peROWMdTyapL2RcptjpQ_hallerbos.jpg"},
    {id: "marieJosE-slide28", src: "assets/img/t/LVZpafa9RpCyPNPLYuSn_sabena-security.jpg"},
  ];

  public album2Data: Array<any> = [
    {id: "marieJosE-slide24", src: "assets/img/t/CBd1zASpTOmZptix3fng_family1.jpg"},
    {id: "marieJosE-slide25", src: "assets/img/t/TVRkzCgS7iNdKgM7PSwg_baby.jpg"},
    {id: "marieJosE-slide26", src: "assets/img/t/WE6rB9dZRTiIWQlP5qsA_kitten3.jpg"},
  ];

  public album3Data: Array<any> = [
    {id: "marieJosE-slide223", src: "assets/img/t/ARSdfjpfSAWvY2J9VpZe_moskow.jpg"},
    {id: "marieJosE-slide224", src: "assets/img/t/C6IS45JTlWcTrL5bnsaw_split-croatia.jpg"},
  ];

  public album4Data: Array<any> = [
    {id: "marieJosE-slide212", src: "assets/img/t/rJwCxPlrTsCi8xbyzE8m_tasselplay.jpg"},
    {id: "marieJosE-slide213", src: "assets/img/t/C6IS45JTlWcTrL5bnsaw_split-croatia.jpg"},
  ];

  /* public albums:Array<any> = [
   {name:"Kindertijd",data:this.album1Data},
   {name:"Familie & vrienden",data:this.album2Data},
   {name:"Voor jou geselecteerd",data:this.album3Data},
   {name:"Relevant vandaag",data:this.album4Data},
   ];
   */

  user: User;

  albums: Album[];

  constructor(public actionsheetCtrl: ActionSheetController,private camera: Camera,private fileChooser: FileChooser,public navCtrl: NavController, private stanizerService: StanizerService,
              private userService: UserService, private storyService: StoryService) {
    this.stanizedYoutubeUrl = this.stanizerService.sanitize(this.youtubeUrl);
  }

  ngOnInit(): void {
    this.userService.getUser("12345").toPromise().then(user => {

      this.user = user;
    });

    this.storyService.getAlbums().toPromise().then(albums => {
      this.albums = albums as Album[];
    });

    this.storyService.getUserStories().toPromise().then(stories =>
      console.log("."));
  }

  getThumb(url: string): string {
    return "assets/img/t/" + url;
  }

  getStories(album: Album): UserStory[] {
    return album.stories.slice(0, 4);
  }

  showDetails(album: Album, index: number) {
    this.navCtrl.push(StoryDetailsPage, {
      "album": album,
      "index": index ? index : 0
    })
  }

  showNewStory(album: Album) {
    let actionSheet = this.actionsheetCtrl.create({
        title: 'Verhaal toevoegen',
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Foto nemen',
            role: 'destructive ',
            icon: 'camera',
            handler: () => {

              this.camera.getPicture({
                destinationType: this.camera
                  .DestinationType.DATA_URL,
                targetWidth: 1000,
                targetHeight: 1000
              }).then((imageData) => {
                // imageData is a base64 encoded string
                let base64Image:string = "data:image/jpeg;base64," + imageData;
                this.navCtrl.push(NewStoryPage, {
                  "dateUrl": base64Image,
                  "album": album
                })
              }, (err) => {
                console.log(err);
              });

            }
          },
          {
            text: 'Foto uit album kiezen',
            role: 'destructive ',
            icon: 'image',
            handler: () => {
              this.fileChooser.open()
                .then(uri => console.log(uri))
                .catch(e => console.log(e));
            }
          },
          {
            text: 'Youtube video kiezen',
            role: 'destructive ',
            icon: 'logo-youtube',
            handler: () => {
              this.navCtrl.push(NewStoryPage, {
                "album": album
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel ',
            icon: 'md-arrow-back',
            handler: () => {
              console.log('canceled');
            }
          },
        ]

      })
    ;
    actionSheet.present();
  }
}
