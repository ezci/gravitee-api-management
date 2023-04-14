/**
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package io.gravitee.apim.plugin.engine.internal;

import io.gravitee.apim.plugin.engine.EnginePlugin;
import io.gravitee.apim.plugin.engine.EnginePluginManager;
import io.gravitee.gateway.reactive.api.engine.EngineConfiguration;
import io.gravitee.plugin.core.api.AbstractSimplePluginHandler;
import io.gravitee.plugin.core.api.Plugin;
import java.io.IOException;
import java.net.URLClassLoader;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * @author Yann TAVERNIER (yann.tavernier at graviteesource.com)
 * @author GraviteeSource Team
 */
@AllArgsConstructor
@NoArgsConstructor
public class EnginePluginHandler extends AbstractSimplePluginHandler<EnginePlugin<?, ?>> {

    @Autowired
    EnginePluginManager enginePluginManager;

    @Override
    public boolean canHandle(Plugin plugin) {
        return EnginePlugin.PLUGIN_TYPE.equalsIgnoreCase(plugin.type());
    }

    @Override
    protected String type() {
        return EnginePlugin.PLUGIN_TYPE;
    }

    @Override
    protected EnginePlugin<?, ?> create(Plugin plugin, Class<?> pluginClass) {
        final Class<? extends EngineConfiguration> configurationClass = new EngineConfigurationClassFinder().lookupFirst(pluginClass);
        return new DefaultEnginePlugin(plugin, pluginClass, configurationClass);
    }

    @Override
    protected void register(EnginePlugin<?, ?> enginePlugin) {
        enginePluginManager.register(enginePlugin);

        // Once registered, the classloader should be released
        final ClassLoader engineClassLoader = enginePlugin.engineFactory().getClassLoader();

        if (engineClassLoader instanceof URLClassLoader) {
            URLClassLoader classLoader = (URLClassLoader) engineClassLoader;
            try {
                classLoader.close();
            } catch (IOException e) {
                logger.error("Unexpected exception while trying to release the engine plugin classloader", e);
            }
        }
    }

    @Override
    protected ClassLoader getClassLoader(Plugin plugin) {
        return new URLClassLoader(plugin.dependencies(), this.getClass().getClassLoader());
    }
}
