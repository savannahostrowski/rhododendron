$(document).ready(function() {
      $('.feeling-good').click(function() {
        $('.no-symptoms').show().fadeIn('slow');
        $('.initial').fadeOut('slow');
    });

    $('.feeling-bad').click(function() {
        $('.input-area').val('');
        $('.symptoms').show().fadeIn('slow');
        $('.initial').fadeOut('slow');
    });

    $('.symptom-history').click(function() {
        $('.trends').show().fadeIn('slow');
        $('.no-symptoms').fadeOut('slow');
    });

    $('.back-to-home').click(function() {
        $('.initial').show().fadeIn('slow');
        $('.trends').fadeOut('slow');
        $('table').remove();

    });

    $('.input-button').click(function() {
        $('.trends').show().fadeIn('slow');
        $('.symptoms').fadeOut('slow');

    });

});