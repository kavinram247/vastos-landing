/**
 * Google Apps Script bound to the VASTOS enquiries spreadsheet.
 *
 * Receives project enquiries from /api/project-inquiry and appends one row per
 * submission. Deploy as a web app with "Execute as: Me" and "Who has access:
 * Anyone" so the Vercel function can reach it unauthenticated, then guard it
 * with the shared secret below.
 *
 * Setup:
 *   1. Open the spreadsheet, Extensions > Apps Script, paste this file.
 *   2. Replace SECRET with a long random string.
 *   3. Deploy > New deployment > Web app, then copy the /exec URL.
 *   4. Put the URL and the same secret into Vercel as SHEETS_WEBHOOK_URL and
 *      SHEETS_WEBHOOK_SECRET.
 */

var SECRET = 'REPLACE_WITH_A_LONG_RANDOM_STRING';
var SHEET_NAME = 'Enquiries';
var HEADERS = [
  'Timestamp',
  'Name',
  'Email',
  'Company',
  'Brief',
  'Submission ID',
];

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return respond({ ok: false, error: 'empty request' });
    }

    var body = JSON.parse(e.postData.contents);

    if (!body.secret || body.secret !== SECRET) {
      return respond({ ok: false, error: 'unauthorized' });
    }

    var sheet = getSheet();
    var submissionId = String(body.submissionId || '');

    // The route fires this once per submission, but a platform-level retry
    // could deliver the same payload twice. The UUID makes that detectable.
    if (submissionId && alreadyRecorded(sheet, submissionId)) {
      return respond({ ok: true, duplicate: true });
    }

    sheet.appendRow([
      new Date(),
      String(body.name || ''),
      String(body.email || ''),
      String(body.company || ''),
      String(body.brief || ''),
      submissionId,
    ]);

    return respond({ ok: true });
  } catch (error) {
    return respond({ ok: false, error: String(error) });
  }
}

function getSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function alreadyRecorded(sheet, submissionId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var column = HEADERS.indexOf('Submission ID') + 1;
  var values = sheet.getRange(2, column, lastRow - 1, 1).getValues();

  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]) === submissionId) return true;
  }

  return false;
}

function respond(payload) {
  return ContentService.createTextOutput(
    JSON.stringify(payload),
  ).setMimeType(ContentService.MimeType.JSON);
}
