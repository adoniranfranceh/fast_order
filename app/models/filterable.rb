module Filterable
  extend ActiveSupport::Concern

  module ClassMethods
    def filter_by_attributes(query, attributes)
      search_params = attributes.each_with_object({}) do |attribute, params|
        if attribute.to_s.include? 'date'
          add_date_params(query, params)
        elsif attribute.to_s.include?('.')
          add_association_params(attribute, query, params)
        else
          params[attribute] = query
        end
      end

      ransack_query = ransack(search_params)
      ransack_query.result(distinct: true)
    end

    private

    def add_date_params(query, params)
      date_query = parse_date(query)
      return unless date_query

      params[:birthdate_gteq] = date_query.beginning_of_day
      params[:birthdate_lteq] = date_query.end_of_day
    end

    def add_association_params(attribute, query, params)
      association, field = attribute.to_s.split('.')
      params["#{association}_#{field}"] = query
    end

    def parse_date(date_string)
      months = I18n.t('date.month_names').compact.map.with_index do |month, index|
        [month.downcase, Date::MONTHNAMES[index + 1]]
      end.to_h

      date_string = replace_month_name(date_string, months)

      formats.each do |format|
        date = Date.strptime(date_string, format)
        return date if date.year > 1900
      rescue ArgumentError
        next
      end

      nil
    end

    def formats
      [
        '%d/%m/%Y',
        '%d-%m-%Y',
        '%d %B %Y',
        '%d de %B de %Y'
      ]
    end

    def replace_month_name(date_string, months)
      months.each do |pt_month, en_month|
        return date_string.gsub(pt_month, en_month) if date_string.downcase.include?(pt_month)
      end
      date_string
    end
  end
end
