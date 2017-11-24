interface IRegexRules {
  regex: RegExp;
  regPlace: any;
}

import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'parserHtml',
  pure: true,
})

export class ParserHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(data?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.parser(data));
  }

  private parser(text: string): string {
    const tags = this.getTags();
    for (let i = 0; i < tags.length; i++) {
      let exec;
      while ((exec = tags[i].regex.exec(text)) !== null) {
        text = text.replace(exec[0], tags[i].regPlace(exec));
      }
    }
    return text;
  }

  private getTags(): IRegexRules[] {
    const removeUndefined = (uri): string => {
      return (uri) ? uri : '';
    };
    return [
      {
        regex: /</ig,
        regPlace: (str) => {
          return '&lt;';
        }
      },
      {
        regex: />/ig,
        regPlace: (str) => {
          return '&gt;';
        }
      },
      {
        regex: /"gi/ig,
        regPlace: (str) => {
          return '&quote;';
        }
      },
      {
        regex: /'/ig,
        regPlace: (str) => {
          return '&apos;';
        }
      },
      {
        regex: /\[\/?br\/?]/ig,
        regPlace: (str) => {
          return '<br>';
        }
      },
      {
        regex: /\[link=((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*](.*?)\[\/link]/ig,
        regPlace: (str) => {
          return '<a rel="nofollow" href="'
            + removeUndefined(str[1])
            + removeUndefined(str[7])
            + removeUndefined(str[8])
            + removeUndefined(str[9])
            + '">'
            + str[10] + '</a>';
        }
      },
      {
        regex: /\[img=((https?:)(\/\/\/?)([\w]*(?::[\w]*)?@)?([\d\w\.-]+)(?::(\d+))?)?([\/\\\w\.()-]*)?(?:([?][^#]*)?(#.*)?)*]/ig,
        regPlace: (str) => {
          return '<img alt="image" style="display: block; width: 100%;height: auto;" src="'
            + removeUndefined(str[1])
            + removeUndefined(str[7])
            + removeUndefined(str[8])
            + removeUndefined(str[9])
            + '">';
        }
      },
      {
        regex: /\[wrap=([0-9]{1,3})](.*?)\[\/wrap]/ig,
        regPlace: (str) => {
          let num = parseInt(str[1], 10);
          num = num > 100 ? 100 : num;
          return '<div style="width:' + num + '%;display:inline-block;vertical-align:middle;">' + str[2] + '</div>';
        }
      },
      {
        regex: /\[color=#?([a-f0-9]{6}|[a-f0-9]{3})](.*?)\[\/color]/ig,
        regPlace: (str) => {
          return '<span style="color:#' + str[1] + ';">' + str[2] + '</span>';
        }
      },
      {
        regex: /\[font=([a-z0-9_.\-\s])*](.*?)\[\/font]/ig,
        regPlace: (str) => {
          return '<span style="font-family:' + str[1] + ';">' + str[2] + '</span>';
        }
      },
      {
        regex: /\[left](.*?)\[\/left]/ig,
        regPlace: (str) => {
          return '<div style="text-align:left;">' + str[1] + '</div>';
        }
      },
      {
        regex: /\[right](.*?)\[\/right]/ig,
        regPlace: (str) => {
          return '<div style="text-align:right;">' + str[1] + '</div>';
        }
      },
      {
        regex: /\[center](.*?)\[\/center]/ig,
        regPlace: (str) => {
          return '<div style="text-align:center;">' + str[1] + '</div>';
        }
      },
      {
        regex: /\*\*(.*?)\*\*/ig,
        regPlace: (str) => {
          return '<b>' + str[1] + '</b>';
        }
      },
      {
        regex: /--(.*?)--/ig,
        regPlace: (str) => {
          return '<span style="text-decoration: line-through;">' + str[1] + '</span>';
        }
      },
      {
        regex: /__(.*?)__/ig,
        regPlace: (str) => {
          return '<span style="text-decoration: underline;">' + str[1] + '</span>';
        }
      },
      {
        regex: /\/\/(.*?)\/\//ig,
        regPlace: (str) => {
          return '<i>' + str[1] + '</i>';
        }
      },
      {
        regex: /@(.*?)\s/ig,
        regPlace: (str) => {
          return '<span class="user-reference">' + str[1] + '</span>';
        }
      }
    ];
  }
}
