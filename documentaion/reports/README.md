<h3 align="center">Documentation Reports</h3>

---

## Table of Contents

- [Reports](#reports)
- [Side Bar](#side_bar)
- [Table Taps](#table_taps)
- [Reports Options](#reports_options)
- [Current Active Report Options](#current_active_report_options)

## Reports <a name = "reports"></a>

**States:**

- **Data_table** this is a big our that have all of data about the reports
- **reportApi** this to store the api of the report
- **vehChecked** this to store the vehicles that use checked
- **reportsOptionsShow** this for show and unshow ReportsOptions Model
- **showCurrentActiveReportOptions** this for show and unshow ActiveReportOptions Model
- **reportTitle** this to store the title of the report
- **fullSelectedReportData** this to store current selected options of the report and all selected reports taps
- **reportsTitleSelectedId** this to store current tap id of the report
- **reportsDataSelected** this to store current report data
- **reportsTitleSelected** this to store current tap title of the report
- **dateStatus** this to store type of date range of report
- **loadingShowReport** this to store the status of request report in ReportsOptions Model
- **loadingShowCurrentReport** this to store the status of request report in ActiveReportOptions Model
- **closeAndOpenReportsList** this to store the status of sidebar
- **vehiclesError** this to store the message for un selected vehicles
- **mainApi** this to store the api and uniqe id for selected reports

**Functions:**

- fetchReports -> this to fetch the report
- handleApi -> this to handling report api
- ShowReports -> this to handling show report when user want to display new report or do override on current report
- handleTap -> this to handling switching between reports
- handleCloseAndOpenReportsList -> this to handling open / close sidebar
- handleCloseTab -> this to handling close selected report

## Side Bar <a name = "side_bar"></a>

**States:**

- **filterInput** this is to store the input search value
- **idCollapse** this is to store the group report is open or closed

**Functions:**

- handleReportsOptionsShow -> this to store information that getting from selected report name

## Table Taps<a name = "table_taps"></a>

**UseTableColumns** -> this page have all of the columns settings and extract each column setting

**Functions:**

- onBtFirst , onBtLast , onBtPrevious ,onBtNext -> controled pagaination buttons
  - onBtNext have condition
    - if (the current total pages number - current page number == 2)
      - get the selected report api
      - fetch report with
        - pageSize -> number of record in each page (default 10 object)
        - pageNumber -> page that after the last page
        - pagesCount -> number of page that you want from backend (default 4 pages)
      - will be an condition
        - if (data that incoming not have message key)
          - filter all reports data to selected report and add incoming report data with it
          - update the big state and selected report with filtered report
          - update the current page number in current page number state
          - go to the next incoming page
        - else (that means there is no data in backend for this report options)
          - make next button disabled
          - update the current page number in big state and selected report
          - update the current page number in current page number state
          - go to the last page
    - else (that means the user make transfering in the current pages)
      - go to next page
      - update the current page number in big state and selected report
      - update the current page number in current page number state

## The Art of Technical Writing <a name = "reports_options"></a>

## Technical Writing Programs <a name = "current_active_report_options"></a>
