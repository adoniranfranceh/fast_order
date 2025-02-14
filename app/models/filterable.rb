module Filterable
  extend ActiveSupport::Concern

  module ClassMethods
    def filter_by_attributes(query, params)
      query = query&.downcase
      joins_tables, conditions, values = process_params(query, params)

      query_result = apply_joins(joins_tables)
      result = query_result.where(conditions.join(' OR '), *values).distinct

      log_query(result, conditions, values)
      result
    end

    private

    def process_params(query, params)
      joins_tables = []
      conditions = []
      values = []

      params.each do |param|
        if param.is_a?(String) && param.include?('.')
          process_relation(param, query, joins_tables, conditions, values)
        else
          process_attribute(param, query, conditions, values)
        end
      end

      [joins_tables, conditions, values]
    end

    def process_relation(param, query, joins_tables, conditions, values)
      relation, column = param.split('.')
      validate_relation(relation)
      associated_table = reflect_on_association(relation.to_sym).klass.table_name

      joins_tables << relation.to_sym
      conditions << "LOWER(#{associated_table}.#{column}) LIKE ?"
      values << "%#{query}%"
    end

    def validate_relation(relation)
      return if reflect_on_association(relation.to_sym)

      raise "Unknown relation: #{relation}"
    end

    def process_attribute(param, query, conditions, values)
      if column_names.include?(param.to_s)
        column_type = columns_hash[param.to_s].type
        conditions << attribute_condition(param, column_type)
        values << "%#{query}%"
      else
        Rails.logger.warn "Column #{param} does not exist in the model #{name}"
      end
    end

    def attribute_condition(param, column_type)
      if %i[string text].include?(column_type)
        "LOWER(#{table_name}.#{param}) LIKE ?"
      else
        "#{table_name}.#{param}::text LIKE ?"
      end
    end

    def apply_joins(joins_tables)
      query_result = all
      joins_tables.uniq.each do |table|
        query_result = query_result.left_joins(table)
      end
      query_result
    end

    def log_query(result, conditions, values)
      Rails.logger.info "Generated SQL query: #{result.to_sql}"
      Rails.logger.info "Filter conditions: #{conditions.join(' OR ')}"
      Rails.logger.info "Values: #{values.inspect}"
    end
  end
end
