import * as Yup from "yup";
import moment from "moment";

const numberValidation = (inputName, required, mustNumber) => {
  return Yup.number()
    .required(`${inputName} ${required}`)
    .typeError(`${inputName} ${mustNumber}`);
};

const emailValidation = (invalid, required) => {
  return Yup.string().email(invalid).required(required).trim();
};

const stringValidation = (inputName, required) => {
  return Yup.string().required(`${inputName} ${required}`).trim();
};

const dateValidation = (inputName, required, mustDate) => {
  return Yup.date()
    .required(`${inputName} ${required}`)
    .typeError(`${inputName} ${mustDate}`);
};

export const addPreventiveMaintenanceValidation = (
  fixedDateCase,
  minDate,
  startValue,
  nextValue,
  selectedVehiclesData,
  t
) => {
  const required = t("is_required_key");
  const mustDate = t("must_be_a_date_key");
  const mustNumber = t("must_be_number_key");

  return Yup.object().shape({
    selectedVehicles:
      !selectedVehiclesData.length &&
      Yup.array()
        .required(t("please_select_a_vehicle_key"))
        .min(1, t("selected_vehicles_field_must_have_at_least_1_vehicle_key")),
    MaintenanceType: stringValidation(t("maintenance_type_key"), required),
    PeriodType: stringValidation(t("period_type_key"), required),
    StartValue: numberValidation(t("start_value_key"), required, mustNumber),
    MaintenanceDueValue: fixedDateCase
      ? dateValidation(t("maintenance_due_value_key"), required, mustDate).min(
        new Date(Date.now() - 86400000),
        `${t(
          "maintenance_due_value_field_must_be_later_than_or_equal_to_key"
        )} ${minDate}`
      )
      : numberValidation(t("maintenance_due_value_key"), required, mustNumber)
        .min(
          0,
          `${t(
            "maintenance_due_value_must_be_greater_than_or_equal_to_key"
          )} 0`
        )
        .max(
          1000000001,

          `${t(
            "maintenance_due_value_must_be_less_than_or_equal_to_key"
          )} 1000000000`
        ),
    NextValue: numberValidation(
      t("next_value_key"),
      required,
      t("must_be_a_number_key")
    ),
    NotifyByEmail: emailValidation(
      t("invalid_email_address_key"),
      t("email_is_required")
    ),
    NotifMessage: stringValidation(t("notify_message_key"), required),
    WhenPeriod: stringValidation(t("notify_period_key"), required),
    PercentageValue: Yup.number().when("PeriodType", {
      is: "3",
      then: Yup.number().notRequired(),
      otherwise: Yup.number().when("WhenPeriod", {
        is: "2",
        then: Yup.number().notRequired(),
        otherwise: numberValidation(
          t("percentage_value_key"),
          required,
          t("must_be_a_number_key")
        )
          .min(
            1,
            `${t("percentage_value_must_be_greater_than_or_equal_to_key")} 1`
          )
          .max(
            100,
            `${t("percentage_value_must_be_less_than_or_equal_to_key")} 100`
          ),
      }),
    }),
    WhenValue: fixedDateCase
      ? dateValidation(t("notify_when_value_key"), required, mustDate)
        .min(
          new Date(Date.now() - 86400000),
          `${t(
            "notify_when_value_field_must_be_later_than_or_equal_to_key"
          )} ${minDate}`
        )
        .max(
          nextValue ? new Date(nextValue) : new Date(),
          t(
            "notify_when_value_field_must_be_at_earlier_than_or_equal_maintenance_due_value_key"
          )
        )
      : selectedVehiclesData?.length > 1
        ? Yup.number().notRequired()
        : numberValidation(
          t("notify_when_value_key"),
          required,
          t("must_be_a_number_key")
        )
          .min(
            startValue,
            t(
              "notify_when_value_must_be_greater_than_or_equal_to_start_value_key"
            )
          )
          .max(
            nextValue,
            t("notify_when_value_must_be_less_than_or_equal_to_next_value_key")
          ),
  });
};

export const editPreventiveMaintenanceValidation = (
  fixedDateCase,
  minDate,
  startValue,
  nextValue,
  t
) => {
  const required = t("is_required_key");
  const mustDate = t("must_be_a_date_key");
  const mustNumber = t("must_be_number_key");

  return Yup.object().shape({
    vehicleName: stringValidation(t("vehicle_name_key"), required),
    MaintenanceType: stringValidation(t("maintenance_type_key"), required),
    PeriodType: stringValidation(t("period_type_key"), required),
    StartValue: fixedDateCase
      ? dateValidation(t("start_value_key"), required, mustDate)
      : numberValidation(t("start_value_key"), required, mustNumber),
    MaintenanceDueValue: fixedDateCase
      ? dateValidation(t("maintenance_due_value_key"), required, mustDate).min(
        new Date(Date.now() - 86400000),
        `${t(
          "maintenance_due_value_field_must_be_later_than_or_equal_to_key"
        )} ${minDate}`
      )
      : numberValidation(t("maintenance_due_value_key"), required, mustNumber)
        .min(
          0,
          `${t(
            "maintenance_due_value_must_be_greater_than_or_equal_to_key"
          )} 0`
        )
        .max(
          1000000001,

          `${t(
            "maintenance_due_value_must_be_less_than_or_equal_to_key"
          )} 1000000000`
        ),
    NextValue: fixedDateCase
      ? dateValidation(t("next_value_key"), required, mustDate)
      : numberValidation(t("next_value_key"), required, mustNumber),
    NotifyByEmail: emailValidation(
      t("invalid_email_address_key"),
      t("email_is_required")
    ),
    NotifMessage: stringValidation(t("notify_message_key"), required),
    WhenPeriod: stringValidation(t("notify_period_key"), required),
    PercentageValue: Yup.number().when("PeriodType", {
      is: t("by_fixed_date_key"),
      then: Yup.number().notRequired(),
      otherwise: Yup.number().when("WhenPeriod", {
        is: "2",
        then: Yup.number().notRequired(),
        otherwise: numberValidation(
          t("percentage_value_key"),
          required,
          mustNumber
        )
          .min(
            1,
            `${t("percentage_value_must_be_greater_than_or_equal_to_key")} 1`
          )
          .max(
            100,
            `${t("percentage_value_must_be_less_than_or_equal_to_key")} 100`
          ),
      }),
    }),
    WhenValue: fixedDateCase
      ? dateValidation(t("notify_when_value_key"), required, mustDate)
        .min(
          new Date(Date.now() - 86400000),
          `${t(
            "notify_when_value_field_must_be_later_than_or_equal_to_key"
          )} ${minDate}`
        )
        ?.max(
          moment(nextValue).isValid() ? new Date(nextValue) : new Date(),
          t(
            "notify_when_value_field_must_be_at_earlier_than_or_equal_maintenance_due_value_key"
          )
        )
      : numberValidation(t("notify_when_value_key"), required, mustNumber)
        .min(
          startValue,
          t(
            "notify_when_value_must_be_greater_than_or_equal_to_start_value_key"
          )
        )
        ?.max(
          nextValue,
          t("notify_when_value_must_be_less_than_or_equal_to_next_value_key")
        ),
  });
};

export const addEditOperateDriver = (t) => {
  const required = t("is_required_key");
  const mustDate = t("must_be_a_date_key");
  const mustNumber = t("must_be_number_key");
  return Yup.object().shape({
    // Regex in this form to accept latin alphabet
    FirstName: stringValidation(t("first_name_key"), required).matches(
      /^[\p{L}]+$/u,
      t("first_name_must_not_have_numbers_key")
    ),
    LastName: stringValidation(t("last_name_key"), required).matches(
      /^[\p{L}]+$/u,
      t("last_name_must_not_have_numbers_key")
    ),
    DateOfBirth: dateValidation(t("date_of_birth_key"), required, mustDate),
    Nationality: stringValidation(t("nationality_key"), required),
    PhoneNumber: stringValidation(t("phone_number_key"), required),
    Email: emailValidation(
      t("invalid_email_address_key"),
      t("email_is_required_key")
    ),
    DLNumber: numberValidation(
      t("license_number_key"),
      required,
      mustNumber
    ).min(0, `${t("license_number_must_be_greater_than_or_equal_to_key")} 0`),
    DLExpirationDate: dateValidation(
      t("license_expiration_date_key"),
      required,
      mustDate
    ),
    Department: stringValidation(t("department_key"), required),
    RFID: stringValidation("RFID", required),
  });
};
