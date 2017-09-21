import $ from 'jquery';

import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/dialog';

function overridePrompt ( args ) {
  if ($('#dialog-override').length<1)
    $('body').append('<div id="dialog-override" title="'+args.title+'" ><p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>'+args.body+'</p></div>');

  $( "#dialog-override" ).dialog({
    resizable: false,
    height: "auto",
    width: 400,
    modal: true,
    buttons: {
      Override: function() {
        if (typeof args.override != 'undefined')
          args.override();
        $( this ).dialog( "close" );
      },
      Cancel: function() {
        if (typeof args.cancel != 'undefined')
          args.cancel();
        $( this ).dialog( "close" );
      }
    }
  });

}

export { overridePrompt };
