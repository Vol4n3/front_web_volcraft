interface IRegexRules {
  regex: RegExp;
  regPlace: any;
}
import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'bbToHtml',
  pure: false,
})


export class BbToHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(data?: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.parser(data));
  }

  private parser(text: string): string {
    const tags = this.getTags();
    for (let i = 0; i < tags.length; i++) {
      text = text.replace(tags[i].regex, tags[i].regPlace);
    }
    return text;
  }

  private getTags(): IRegexRules[] {

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
        regex: /\[\/?br\/?\]/ig,
        regPlace: (str) => {
          return '<br>';
        }
      },
      {
        regex: /\[youtube\=([-_a-z0-9]*)\]/ig,
        regPlace: (str) => {
          return '<div style="position: relative;">'
            + '<img style="display: block;width: 100%;height: auto;" src="data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7"/>'
            + '<iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" class="youtube" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/'
            + str[1] + '?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>'
            + '</div>';
        }
      },
      {
        regex: /\[soundcloud\=(https?\:\/\/[\-_a-z0-9.\/]*)\]/ig,
        regPlace: (str) => {
          return '<div style="position: relative;" >'
            + '<img style="display: block;width: 100%;height: auto;" src="data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7"/>'
            + '<iframe  style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" class="youtube" type="text/html" src="https://w.soundcloud.com/player/?url='
            + encodeURI(str[1]) + '?&color=black_white&visual=true&show_comments=true&hide_related=true&show_reposts=false" frameborder="0" scrolling="no"></iframe>'
            + '</div>';
        }
      },
      {
        regex: /\[vimeo\=([-_a-z0-9]*)\]/ig,
        regPlace: (str) => {
          return '<div style="position: relative;">'
            + '<img style="display: block;width: 100%;height: auto;"'
            + ' src="data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7"/>'
            + '<iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" class="youtube" type="text/html"'
            + ' width="640" height="360" src="https://player.vimeo.com/video/'
            + str[1] + '?badge=0" frameborder="0" allowfullscreen></iframe>'
            + '</div>';
        }
      },
      {
        regex: /\[dailymotion\=([-_a-z0-9]*)\]/ig,
        regPlace: (str) => {
          return '<div style="position: relative;">'
            + '<img style="display: block;width: 100%;height: auto;"'
            + 'src="data:image/gif;base64,R0lGODlhEAAJAIAAAP///wAAACH5BAEAAAAALAAAAAAQAAkAAAIKhI+py+0Po5yUFQA7"/>'
            + '<iframe style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" class="dailymotion" type="text/html"'
            + ' width="640" height="360" '
            + 'src="http://www.dailymotion.com/embed/video/' + str[1]
            + '?endscreen-enable=false&ui-logo=false" frameborder="0" allowfullscreen></iframe>'
            + '</div>';
        }
      },
      {
        regex: /\[img=((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\]\s]+)[\a-z]*?(#[\w\-]+)?\]/ig,
        regPlace: (str) => {
          return '<img style="display: block; width: 100%;height: auto;" src="' + str[2] + '://' + str[3].str[4].str[6] + '">';
        }
      },
      {
        regex: /\[wrap=([0-9]{1,3})\](.*?)\[\/wrap\]/ig,
        regPlace: (str) => {
          let num = parseInt(str[1], 10);
          num = num > 100 ? 100 : num;
          return '<div style="width:' + num + '%;display:inline-block;vertical-align:middle;">' + str[2] + '</div>';
        }
      },
      {
        regex: /\[color=([a-f0-9]{6})\](.*?)\[\/color\]/ig,
        regPlace: (str) => {
          return '<font color="' + str[1] + '">' + str[2] + '</font>';
        }
      },
      {
        regex: /\[font=([a-z0-9_\.\-\s])*\](.*?)\[\/font\]/ig,
        regPlace: (str) => {
          return '<font face="' + str[1] + '">' + str[2] + '</font>';
        }
      },
      {
        regex: /\[left\](.*?)\[\/left\]/ig,
        regPlace: (str) => {
          return '<div style="text-align:left;">' + str[1] + '</div>';
        }
      },
      {
        regex: /\[right\](.*?)\[\/right\]/ig,
        regPlace: (str) => {
          return '<div style="text-align:right;">' + str[1] + '</div>';
        }
      },
      {
        regex: /\[center\](.*?)\[\/center\]/ig,
        regPlace: (str) => {
          return '<div style="text-align:center;">' + str[1] + '</div>';
        }
      },
      {
        regex: /\[h1\](.*?)\[\/h1\]/ig,
        regPlace: (str) => {
          return '<h1>' + str[1] + '</h1>';
        }
      },
      {
        regex: /\[h2\](.*?)\[\/h2\]/ig,
        regPlace: (str) => {
          return '<h2>' + str[1] + '</h2>';
        }
      },
      {
        regex: /\[h3\](.*?)\[\/h3\]/ig,
        regPlace: (str) => {
          return '<h3>' + str[1] + '</h3>';
        }
      },
      {
        regex: /\[h4\](.*?)\[\/h4\]/ig,
        regPlace: (str) => {
          return '<h4>' + str[1] + '</h4>';
        }
      },
      {
        regex: /\[h5\](.*?)\[\/h5\]/ig,
        regPlace: (str) => {
          return '<h5>' + str[1] + '</h5>';
        }
      },
      {
        regex: /\[h6\](.*?)\[\/h6\]/ig,
        regPlace: (str) => {
          return '<h6>' + str[1] + '</h6>';
        }
      },
    ];
  }
}
