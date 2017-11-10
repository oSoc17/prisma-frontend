import {Observable, pipe} from "rxjs/Rx";
import {UserStory} from "../dto/user-story";
import { map, switchMap, catchError } from 'rxjs/operators'

export interface youtubeResponse {
  items: {
    0: {
      snippet: {
        thumbnails: {
          default: {
            url: string
          },
          medium: {
            url: string
          },
          high: {
            url: string
          },
          standard: {
            url: string
          }
        },
        description: string,
      }
    }
  }
  pageInfo: {
    totalResults: number
  }
}

export const getMessageFromBackendError = (message: string | { [key: string]: string[] } = '') => {
  if (typeof message === 'string') {
    return message;
  }

  return Object.keys(message).reduce((acc, next) => {
    return `${acc}
      ${message[next].join('\n')}
    `;
  }, '');
};


export function getUrlImage(filename: string): Observable<string | Error> {
  let header: Headers = new Headers({'Content-Type': 'image/jpg'});
  return this.http.get(`${filename}`, {
    header,
    responseType: 'blob'
  })
  .pipe(
    map(blob => URL.createObjectURL(blob)),
    catchError(this.handleError)
  )
}

export function background(story: UserStory): Observable<string | Error>{
  return Observable.of(story)
    .pipe(
      map((item:UserStory) => {
        if (item.type !== "youtube") {
          return this.getImage(item.source)
        } else {
          return this.getThumb(item.source)
        }
      }),
      switchMap((x:Observable<string | Error>) => x)
    )
}


export const getThumbnails = (url):string => {
  if (!url) {
    return '';
  }
  let video = youtubeId(url)
  return 'http://img.youtube.com/vi/' + video + '/0.jpg';
};

export const youtubeId = (url: string): string => {
  const regExp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|watch\/|v\/)?)([\w\-]+)(\S+)?$/;
  const match = url.match(regExp);

  if (match && match[5].length == 11) {
    return match[5];
  } else {
    return '';
  }
};

export const validYoutubeLink = (url):Boolean =>{
  const youtubeLinkRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|watch\/|v\/)?)([\w\-]+)(\S+)?$/
  return url.toLowerCase().match(youtubeLinkRegex)
};


export function getYoutubeDescriptionAndThumbnail(url): Observable<Object | Error>{
  if (validYoutubeLink(url)) {
    const urlId = youtubeId(url);

    return this.http.get(`https://www.googleapis.com/youtube/v3/videos?id=${urlId}&key=${this.env.youtubeApiKey}&part=snippet`)
      .pipe(
        map((res: youtubeResponse) => ({
          thumbnail : res.pageInfo.totalResults ? res.items[0].snippet.thumbnails :  null,
          description: res.items[0].snippet.description
        })),
        map((res :{thumbnail:Object, description:string}) => {
          const last = Object.keys(res.thumbnail)[Object.keys(res.thumbnail).length-1];
          return {...res, thumbnail: res.thumbnail[last].url}
        }),
        catchError(() =>  Observable.of({}))
      )
  } else {
    return Observable.of(null)
  }
}
