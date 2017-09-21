$(document).ready(function() {
      $('.feeling-good').click(function() {
        $('.no-symptoms').show().fadeIn('slow');
        $('.initial').fadeOut('slow');
    });

    $('.feeling-bad').click(function() {
        $('.symptoms').show().fadeIn('slow');
        $('.initial').fadeOut('slow');
    });

    $('.symptom-history').click(function() {
        $('.trends').show().fadeIn('slow');
        $('.no-symptoms').fadeOut('slow');
    });

    $('.back-to-home').click(function() {
        $('.trends').fadeOut('slow');
        $('.initial').show().fadeIn('slow');

    });

});