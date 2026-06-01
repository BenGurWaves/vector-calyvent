/* VECTOR — shared client-side Text to PDF converter (no decorative dependencies). */
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var textInput = document.getElementById('textInput');
    var processingStatus = document.getElementById('processingStatus');
    var outputSection = document.getElementById('outputSection');
    var downloadButton = document.getElementById('downloadButton');
    if (!textInput || !downloadButton) return;

    var fileName = downloadButton.getAttribute('data-filename') || 'vector-document.pdf';
    var draftKey = 'vector.draft.' + (location.pathname || '/');

    // Client-only draft persistence — stays on this device, never transmitted.
    try {
      var saved = localStorage.getItem(draftKey);
      if (saved) textInput.value = saved;
    } catch (e) { /* private mode — proceed without persistence */ }

    textInput.addEventListener('input', function () {
      try { localStorage.setItem(draftKey, textInput.value); } catch (e) { /* ignore */ }
    });

    function addStatusLine(text, active) {
      if (!processingStatus) return;
      var line = document.createElement('div');
      line.className = 'status-line' + (active ? ' active' : '');
      line.textContent = text;
      processingStatus.appendChild(line);
      setTimeout(function () { line.classList.add('visible'); }, 50);
      if (active) {
        var prev = processingStatus.querySelector('.status-line.active:not(:last-child)');
        if (prev) prev.classList.remove('active');
      }
    }

    function clearStatus() { if (processingStatus) processingStatus.innerHTML = ''; }

    downloadButton.addEventListener('click', function () {
      var text = textInput.value.trim();
      clearStatus();
      if (processingStatus) processingStatus.classList.add('visible');

      if (!text) {
        addStatusLine('Enter some text above to generate a PDF.');
        return;
      }

      addStatusLine('Initializing PDF generation...', true);

      try {
        if (!window.jspdf) throw new Error('jsPDF not loaded');
        var jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF();

        var pageWidth = doc.internal.pageSize.getWidth();
        var pageHeight = doc.internal.pageSize.getHeight();
        var margin = 25;
        var maxWidth = pageWidth - margin * 2;
        var lineHeight = 8;
        var timestamp = new Date().toLocaleString();

        function addFooter(pageNum, totalPages) {
          var footerY = pageHeight - 15;
          doc.setTextColor(128);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.text('VECTOR', margin, footerY);
          doc.text('Generated: ' + timestamp, pageWidth / 2, footerY, { align: 'center' });
          doc.text('vector.calyvent.com', pageWidth - margin, footerY, { align: 'right' });
          doc.setFontSize(6);
          doc.text(pageNum + ' / ' + totalPages, pageWidth / 2, footerY + 5, { align: 'center' });
        }

        doc.setTextColor(0);
        doc.setFontSize(11);
        doc.setFont('times', 'normal');

        var lines = doc.splitTextToSize(text, maxWidth);
        var totalPages = 1;
        var tempY = margin;
        lines.forEach(function () {
          if (tempY > pageHeight - 30) { totalPages++; tempY = margin; }
          tempY += lineHeight;
        });

        addStatusLine('Processing ' + lines.length + ' lines across ' + totalPages + ' pages', true);

        addFooter(1, totalPages);
        var y = margin;
        var currentPage = 1;
        doc.setTextColor(0);
        doc.setFontSize(11);
        doc.setFont('times', 'normal');

        lines.forEach(function (line) {
          if (y > pageHeight - 30) {
            currentPage++;
            doc.addPage();
            addFooter(currentPage, totalPages);
            y = margin;
            doc.setTextColor(0);
            doc.setFontSize(11);
            doc.setFont('times', 'normal');
          }
          doc.text(line, margin, y);
          y += lineHeight;
        });

        addStatusLine('Generating PDF', true);
        doc.save(fileName);
        addStatusLine('PDF downloaded successfully');
        if (outputSection) outputSection.classList.add('visible');
      } catch (err) {
        addStatusLine('Generation failed. Please reload the page and try again.');
      }
    });
  });
})();
