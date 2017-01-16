/*

 From accessories.js


        // Event on Custom checkboxes
        $(".custom-checkbox").change(function(){
          // cheched
          if($(this).prop('checked')){
            //console.log("just check, hide unchecked, show checked", $('.icon-unchecked',$(this).next()));
            $('.icon-unchecked',$(this).next()).hide();
            $('.icon-checked',$(this).next()).show();
          }else{
            $('.icon-unchecked',$(this).next()).show();
            $('.icon-checked',$(this).next()).hide();
          }
        });
*/
